import { ClassesCustomRepository } from './../classes/classes.repository';
import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { UsersCustomRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from 'src/database/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserWithoutPassword } from './types/userWithoutPassword.type';
import { TrainersCustomRepository } from '../trainers/trainers.repository';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private usersCustomRepository: UsersCustomRepository,
    private trainersCustomRepository: TrainersCustomRepository,
    private classesCustomRepository: ClassesCustomRepository,
  ) {}

  async onModuleInit() {
    setTimeout(() => {
      console.info('Seeding your database');
    }, 1000);
    setTimeout(() => {
      console.info('Seeding users');
    }, 1200);
    setTimeout(() => {
      this.userSeeder();
    }, 2000);
    setTimeout(() => {
      console.info('Seeding trainers');
    }, 2500);
    setTimeout(() => {
      this.trainersCustomRepository.initializeTrainers();
    }, 3000);
  }

  //   this.classesCustomRepository.initializeClasses();

  async userSeeder() {
    return await this.usersCustomRepository.initializeUser();
  }

  async getUser(userID: string): Promise<UserWithoutPassword> {
    const foundUser: User | undefined = await this.usersRepository.findOne({
      where: { id: userID },
    });
    if (!foundUser) throw new NotFoundException('user not found or not exist');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...filteredUser } = foundUser;
    return foundUser;
  }

  async getUsers(page: number, limit: number) {
    let users = await this.usersRepository.find();

    const startingIndex = (page - 1) * limit;
    const endingIndex = startingIndex + +limit;

    users = users.slice(startingIndex, endingIndex);

    return users;
  }

  async getUserById(id: string) {
    return await this.usersCustomRepository.getUserById(id);
  }

  async getUsersByEmail(email: string) {
    return email;
  }

  async createUser(createUserDto: CreateUserDto) {
    const newUser = await this.usersCustomRepository.createUser(createUserDto);
    return newUser;
  }

  async updateUser(id: string, user: any) {
    return await this.usersCustomRepository.updateUser(id, user);
  }

  async deleteUser(id: string) {
    return await this.usersCustomRepository.remove(id);
  }
}
