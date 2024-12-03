import { UsersService } from './../users/users.service';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from 'src/database/entities/user.entity';
import { LoginUserDto } from './dto/signInUser.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../email/email.service';
import { authCustomRepository } from './auth.repository';
import { AuthZeroDTO } from './dto/auth0-logIn.dto';
import { CreateUserDto } from './dto/signUpUser.dto';
import { UserWithoutPassword } from '../users/types/userWithoutPassword.type';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly userService: UsersService,
    private readonly authCustomRepo: authCustomRepository,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async signUpAuth(authZeroData: AuthZeroDTO) {
    // check if user exists within database
    const userExists: User = await this.usersRepository.findOne({
      where: { email: authZeroData.email },
    });

    if (userExists !== null) {
      if (userExists.auth === 'google') {
        return {
          userID: userExists.id,
          userName: userExists.name,
          userEmail: userExists.email,
          userRol: userExists.roles,
          userAuth: userExists.auth,
          userMembershipStatus: userExists.membership_status,
          userCreatedAt: userExists.created_At,
        };
      }

      if (userExists.auth === 'form') {
        // esta info se va a addJWT.interceptor.ts
        return {
          userID: userExists.id,
          userName: userExists.name,
          userEmail: userExists.email,
          userRol: userExists.roles,
          userAuth: userExists.auth,
          userMembershipStatus: userExists.membership_status,
          userCreatedAt: userExists.created_At,
        };
        throw new ConflictException(
          'User is already registered within database with form',
        );
      }

      if (userExists !== null && userExists.auth === 'googleIncomplete') {
        if (
          userExists.password === null ||
          userExists.phone === null ||
          userExists.country === null ||
          userExists.address === null
        ) {
          console.log('User may update his profile to complete its data');
          return userExists;
        }

        if (
          userExists.password.length === 60 &&
          userExists.phone !== null &&
          userExists.country !== null &&
          userExists.address !== null
        ) {
          console.log('Cae en auth.service.ts linea 83');
          return {
            userID: userExists.id,
            userName: userExists.name,
            userEmail: userExists.email,
            userRol: userExists.roles,
            userAuth: userExists.auth,
            userMembershipStatus: userExists.membership_status,
            userCreatedAt: userExists.created_At,
          };
        }
        // return userExists;
      }
    } else if (userExists === null) {
      try {
        const { name, email, image } = authZeroData;

        console.info(`
        User Signing Up Data:
        name: ${name},
        email: ${email},
        image: ${image}
        `);

        const userData = {
          name: name,
          email: email,
          image: image,
          auth: 'googleIncomplete',
        };

        const newUserFromAuthZero = await this.signUpThirdParty(userData);

        return newUserFromAuthZero;
      } catch (error) {
        throw new BadRequestException(
          'User insertion within database error.',
          error.message,
        );
      }
    }
  }

  async signUpThirdParty(userData: AuthZeroDTO): Promise<Partial<User>> {
    const checkUser = await this.usersRepository.findOne({
      where: { email: userData.email },
    });
    if (checkUser) {
      console.warn('User with this email already exists');
      throw new ConflictException('User with this email already exists');
    }

    if (checkUser === null) {
      const newUser = this.usersRepository.create(userData);
      await this.usersRepository.save(newUser);

      try {
        await this.emailService.sendWelcomeEmail(newUser.email, newUser.name);
      } catch (error) {
        console.error('Error while sending :', error.message);
      }

      const user: UserWithoutPassword = await this.usersRepository.findOne({
        where: { email: userData.email },
      });

      return user;
    }
  }

  async signUpForm(userData: CreateUserDto): Promise<Partial<User>> {
    const checkUser: User[] = await this.usersRepository.find({
      where: { email: userData.email },
    });
    if (checkUser.length) {
      console.warn('user with this email already exists');
      throw new ConflictException('user with this email already exists');
    }

    const newUser: User = this.usersRepository.create(userData);

    const { password, email } = newUser;

    if (!password || !email)
      throw new BadRequestException('Valid email and password are required');

    const hashedPassword = await bcrypt.hash(password, 10);

    if (!hashedPassword) {
      throw new BadRequestException(`Password encryption error`);
    } else {
      newUser.password = hashedPassword;
    }

    await this.usersRepository.save(newUser);
    const user: UserWithoutPassword = await this.usersRepository.findOne({
      where: { email: email },
    });

    return user;
  }

  async signIn(userData: LoginUserDto) {
    const userFound: User | undefined = await this.usersRepository.findOne({
      where: { email: userData.email },
    });
    if (!userFound) {
      console.error('User does not exist');
      throw new NotFoundException('User does not exist');
    }

    if (userFound.banned) {
      throw new ForbiddenException(
        `Your account has been banned. Reason: ${userFound.banReason || 'No reason provided.'}`,
      );
    }

    const validatedPassword = await bcrypt.compare(
      userData.password,
      userFound.password,
    );

    console.log('User Data:', userData);
    console.log('Found User:', userFound);
    console.log('Found User ROLE:', userFound.roles);
    console.log('Password Match:', validatedPassword);

    if (validatedPassword === true) {
      const userPayload = {
        id: userFound.id,
        name: userFound.name,
        email: userFound.email,
        roles: userFound.roles,
        phone: userFound.phone,
        country: userFound.country,
        address: userFound.address,
        banned: userFound.banned,
        banSatus: userFound.banStatus,
        banReason: userFound.banReason,
      };

      const token = this.jwtService.sign(userPayload);
      return {
        message: 'User logged in successfuly',
        userData: userFound,
        token: token,
        expires_in: process.env.JWT_EXPIRES_IN,
      };
    } else throw new BadRequestException('Incorrect Credentials');
  }

  async updateUserInformation(user: User, param: Partial<User>) {
    await this.usersRepository.update(user.id, param);
    return;
  }
}
