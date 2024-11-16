import { UsersService } from './../users/users.service';
import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from 'src/database/entities/user.entity';
import { LoginUserDto } from './dto/loginUser.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';



@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  create() {
    return 'This action adds a new auth';
  }

  //  @nechodev working here
  async signUp(userData: CreateUserDto): Promise<Partial<User>> {
    const checkUser: User[] = await this..find({
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
    const user: UserWithoutPassword = await this.usersService.getUser(
      newUser.id,
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { orders, ...UserWithoutPassword } = user;

    return UserWithoutPassword;
  }

  // @Anahidia working here
  async signIn(userData: LoginUserDto) {
    const foundUser= await this.userService.getUsersByEmmail(userData.email)

    if(!foundUser) throw new BadRequestException('invalid credentials')

      const validatePassword= await bcrypt.compare(userData.password, foundUser.password);

      if(!validatePassword) throw new BadRequestException('invalid credentials')

        const payload={
          id: foundUser.id,
          email:foundUser.email,
          rol:foundUser.rol
        }
    
        const token = this.jwtService.sign(payload);

        return {
          message: 'load-in user',
          token,
        };
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
