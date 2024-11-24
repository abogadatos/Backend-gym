import { UsersService } from './../users/users.service';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/signUpUser.dto';
import { User } from 'src/database/entities/user.entity';
import { LoginUserDto } from './dto/signInUser.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserWithoutPassword } from '../users/types/userWithoutPassword.type';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../email/email.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  //  @nechodev working here
  async signUp(userData: CreateUserDto): Promise<Partial<User>> {
    const checkUser: User[] = await this.usersRepository.find({
      where: { email: userData.email },
    });
    if (checkUser.length) {
      console.warn('User with this email already exists');
      throw new ConflictException('user with this email already exists');
    }

    const newUser: User = this.usersRepository.create(userData);

    const { password, email } = newUser;

    if (!password || !email) {
      console.warn('Valid email and password are required');
      throw new BadRequestException('Valid email and password are required');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    if (!hashedPassword) {
      console.warn('Password encryption error');
      throw new BadRequestException(`Password encryption error`);
    } else {
      newUser.password = hashedPassword;
    }

    await this.usersRepository.save(newUser);

    try {
      await this.emailService.sendWelcomeEmail(newUser.email, newUser.name);
    } catch (error) {
      console.error('No se pudo enviar el email de bienvenida:', error.message);
    }
    const user: UserWithoutPassword = await this.userService.getUser(
      newUser.id,
    );

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
