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
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../email/email.service';
// import { status } from 'src/enum/status.enum';
import { authCustomRepository } from './auth.repository';
import { AuthZeroDTO } from './dto/auth0-logIn.dto';
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

  async signUpAuthZero(authZeroData: AuthZeroDTO) {
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
      console.log(typeof userExists);
      console.warn(`
          User with this email already exists from authZeroSignUp:
          id: ${userExists.id},
          name: ${userExists.name},
          email: ${userExists.email},
          password: ${userExists.password},
          roles: ${userExists.roles},
          status: ${userExists.status},
          membershipStatus: ${userExists.membership_status}
          `);
      throw new ConflictException(
        'User with this email already exists from authZeroSignUp',
      );
    } else if (userExists === null) {
      try {
        const userData = {
          name: name,
          email: email,
          image: image,
          //   status: status.Pending,
          //   roles: authZeroData.roles || Role.User,
        };

        // console.info(
        //   `Inserting new user from authZeroSignUp: ${userExists.name}`,
        // );

        const newUserFromAuthZero = await this.signUp(userData);

        // return await this.authCustomRepo.justRegisteredUser(`
        //     Inserting new user from authZeroSignUp: ${newUserFromAuthZero}
        //     `);

        return newUserFromAuthZero;
      } catch (error) {
        throw new BadRequestException('User insertion within databse error.');
      }
    }

    // if (userExists[0].status === status.Pending) {
    //   const hashedIDComparision = await bcrypt.compare(
    //     authZeroData.id,
    //     userExists[0].id,
    //   );
    //   if (hashedIDComparision === false) {
    //     throw new BadRequestException('Invalid Credentials in auth 1');
    //   }
    //   return await this.authCustomRepo.justRegisteredUser(userExists[0].id);
    // }

    // if (userExists[0].status === status.PartialActive) {
    //   const hashedUserID = await bcrypt.hashSync(authZeroData.id, 10);
    //   await this.usersRepository.update(userExists[0].id, {
    //     status: status.Active,
    //     id: hashedUserID,
    //     image: authZeroData.image,
    //   });
    //   return await this.authCustomRepo.justRegisteredUser(userExists[0].id);
    // }

    // if (userExists[0].status === status.Active) {
    //   const hashedUserIDComparison = await bcrypt.compare(
    //     authZeroData.id,
    //     userExists[0].id,
    //   );
    //   if (hashedUserIDComparison === false) {
    //     throw new BadRequestException('Invalid Credentials in auth 2');
    //   }
    // }
  }

  async signUp(userData): Promise<Partial<User>> {
    const checkUser = await this.usersRepository.findOne({
      where: { email: userData.email },
    });
    if (checkUser) {
      console.warn('User with this email already exists from signUp');
      throw new ConflictException(
        'user with this email already exists from signUp',
      );
    }

    if (checkUser === null) {
      const newUser = this.usersRepository.create(userData);
      await this.usersRepository.save(newUser);
      console.log(`newUserData is${newUser}`);

      const user = this.authCustomRepo.justRegisteredUser(newUser);

      return user;
    }

    // if (newUser[0].roles !== Role.SuperAdmin) {
    //   console.info('User is superAdmin');
    //   //   await this.emailService.sendWelcomeEmail();
    // }

    // const { password, email } = newUser[0];

    // if (!password || !email) {
    //   console.warn('Valid email and password are required');
    //   throw new BadRequestException('Valid email and password are required');
    // }

    // const hashedPassword = await bcrypt.hash(password, 10);

    // if (!hashedPassword) {
    //   console.warn('Password encryption error');
    //   throw new BadRequestException(`Password encryption error`);
    // } else {
    //   newUser.password = hashedPassword;
    // }

    // try {
    //   await this.emailService.sendWelcomeEmail(
    //     newUser[0].email,
    //     newUser[0].name,
    //   );
    // } catch (error) {
    //   console.error('No se pudo enviar el email de bienvenida:', error.message);
    // }
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
