import { UsersService } from './../users/users.service';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
// import { CreateUserDto } from './dto/signUpUser.dto';
import { User } from 'src/database/entities/user.entity';
import { LoginUserDto } from './dto/signInUser.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../email/email.service';
// import { status } from 'src/enum/status.enum';
import { authCustomRepository } from './auth.repository';
import { AuthZeroDTO } from './dto/auth0-logIn.dto';
import { CreateUserDto } from './dto/signUpUser.dto';
import { UserWithoutPassword } from '../users/types/userWithoutPassword.type';
// import { Role } from 'src/enum/roles.enum';

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

    const { name, email, image } = authZeroData;
    console.info(`
    User trying to signUp:
    name: ${name},
    email: ${email},
    image: ${image}
    `);

    if (userExists !== null) {
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
      } else if (userExists !== null && userExists.auth === 'google') {
        if (userExists.password === null) {
          return 'user must complete its profile';
        } else if (userExists.password.length === 60) {
          console.log(userExists.password.length);
          return {
            message: 'User log in successful',
            userData: userExists,
          };
        }
        return userExists;
      }
    } else if (userExists === null) {
      try {
        const userData = {
          name: name,
          email: email,
          image: image,
          auth: 'google',
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

  async signUpThirdParty(userData): Promise<Partial<User>> {
    const checkUser = await this.usersRepository.findOne({
      where: { email: userData.email },
    });
    if (checkUser) {
      console.warn('User with this email already exists from signUpThirdParty');
      throw new ConflictException(
        'user with this email already exists from signUp',
      );
    }

    if (checkUser === null) {
      const newUser = this.usersRepository.create(userData);
      await this.usersRepository.save(newUser);

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
    if (checkUser.length)
      throw new ConflictException('user with this email already exists');

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

  // @Anahidia working here
  async signIn(userData: LoginUserDto) {
    const userFound: User | undefined = await this.usersRepository.findOne({
      where: { email: userData.email },
    });
    if (!userFound) {
      console.error('User does not exist');
      throw new NotFoundException('User does not exist');
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
      };

      const token = this.jwtService.sign(userPayload);
      return {
        message: 'User logged in successfuly',
        userID: userFound.id,
        usedData: userFound,
        token: token,
        expires_in: process.env.JWT_EXPIRES_IN,
      };
    } else throw new BadRequestException('Incorrect Credentials');
  }
}
