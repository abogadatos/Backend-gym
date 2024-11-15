import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from 'src/database/entities/user.entity';

@Injectable()
export class UsersService {
  
  constructor(private usersRepository:UsersRepository){} 
  getUsers(){
    return this.usersRepository.findAll();
  }
  async create(createUserDto: CreateUserDto) {
    const newUser = this.usersRepository.createUser(createUserDto); 
    return newUser
  }
  
  getUserById(id: string) {
    return this.usersRepository.getUserById(id);
  }

  update() {
    return `This action updates user`;
  }

  delete(id: string) {
    return this.usersRepository.remove(id);
  }
}
