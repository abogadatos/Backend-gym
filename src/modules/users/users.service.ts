import { Injectable, OnModuleInit } from '@nestjs/common';
import { UsersCustomRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from 'src/database/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private usersCustomRepository: UsersCustomRepository,
  ) {}

  async onModuleInit() {
    setTimeout(() => {
      console.warn('seeding your database');
    }, 1000);
    setTimeout(() => {
      this.userSeeder();
    }, 2000);
  }

  async getUsers(page: number, limit: number) {
    let users = await this.usersRepository.find();

    const startingIndex = (page - 1) * limit;
    const endingIndex = startingIndex + +limit;

    users = users.slice(startingIndex, endingIndex);

    return users;
  }

  async userSeeder() {
    return this.usersCustomRepository.initializeUser();
  }

  async create(createUserDto: CreateUserDto) {
    const newUser = this.usersCustomRepository.createUser(createUserDto);
    return newUser;
  }

  getUserById(id: string) {
    return this.usersCustomRepository.getUserById(id);
  }

  update() {
    return `This action updates user`;
  }

  delete(id: string) {
    return this.usersCustomRepository.remove(id);
  }
}
