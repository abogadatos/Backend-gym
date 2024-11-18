import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/entities/user.entity';
import { Repository } from 'typeorm';
import * as data from '../../utils/mock-users.json';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersCustomRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async initializeUser() {
    const existingUsers = await this.userRepository.count();

    if (existingUsers === 0) {
      for (const person of data) {
        console.log(`${person.firstName} was added`);

        this.userRepository
          .createQueryBuilder()
          .insert()
          .into(User)
          .values({
            name: person.firstName,
            email: person.email,
            password: await bcrypt.hash(person.password, 10),
            phone: person.phone,
            country: person.country,
            address: person.address,
          })
          .orIgnore()
          .execute();
      }
      console.log(`Users were added from users' custom repo`);
      return {
        message: `Users were added from users' custom repo`,
      };
    } else if (existingUsers > 0) {
      console.warn('Users already exist within database');
      return `Users already exist within database`;
    }
  }

  async createUser(user: Partial<User>) {
    const newUser = await this.userRepository.save(user);
    const dbUser = await this.userRepository.findOneBy({ id: newUser.id });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userNoPassword } = dbUser;
    return userNoPassword;
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('No se Enontro el usuario');

    return user;
  }

  async getUsersByEmmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }

  async updateUser(id: string, user: Partial<User>): Promise<any> {
    const userExists = await this.userRepository.findOne({ where: { id } });

    if (!userExists) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    await this.userRepository.update(id, user);
    const updatedUser = await this.userRepository.findOne({ where: { id } });
    // const { password, ...userNoPassword } = updatedUser;

    return updatedUser;
  }

  async remove(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('No se Enontro el usuario');
    this.userRepository.remove(user);

    return `Usuario con ${user.id} fue eliminado correctamente`;
  }
}
