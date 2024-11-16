import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
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

  async getUsersByEmmail(email:string){
    return await this.getUsersByEmmail(email)
  }

  async getUsers(page: number, limit: number) {
    let users = await this.usersRepository.find();

    const startingIndex = (page - 1) * limit;
    const endingIndex = startingIndex + +limit;

    users = users.slice(startingIndex, endingIndex);

    return users;
  }

  async userSeeder() {
    return await this.usersCustomRepository.initializeUser();
  }

  async create(createUserDto: CreateUserDto) {
    const newUser = await this.usersCustomRepository.createUser(createUserDto);
    return newUser;
  }

  async getUserById(id: string) {
    return await this.usersCustomRepository.getUserById(id);
  }

  async updateUser(id:string,user:any){
    return await this.usersCustomRepository.updateUser(id,user);
  }

  async delete(id: string) {
    return await this.usersCustomRepository.remove(id);
  }
}
