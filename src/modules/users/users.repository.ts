import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>) {}

  
    async createUser(user:Partial<User>){
      const newUser= await this.userRepository.save(user);
      const dbUser= await this.userRepository.findOneBy({id:newUser.id})

      const {password,...userNoPassword}=dbUser;
      return userNoPassword;
 
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async getUserById(id: string): Promise<User> {
    const user= await this.userRepository.findOne({ where:{id} }); 
    if(!user) throw new NotFoundException ("No se Enontro el usuario")
      
      return user;
  }

  async update(id: string, updateUserDto: Partial<CreateUserDto>): Promise<User> {
    await this.userRepository.update(id, updateUserDto); 
    return this.userRepository.findOneBy({ id }); 
  }

  async remove(id: string){
    const user= await this.userRepository.findOneBy({id});
        if(!user) throw new NotFoundException ("No se Enontro el usuario")
        this.userRepository.remove(user); 
        
        
        return `Usuario con ${ user.id } fue eliminado correctamente`;
    }
}