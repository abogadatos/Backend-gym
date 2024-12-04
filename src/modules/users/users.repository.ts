import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/entities/user.entity';
import { Repository } from 'typeorm';
import * as data from '../../utils/mock-users.json';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/enum/roles.enum';
import { validate } from 'class-validator';
import { UpdateUserDto } from './dto/updateUser.dto';

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
        // Convert the string role to the Role enum
        const roleEnum =
          Role[
            person.roles.toLowerCase() === 'super'
              ? 'SuperAdmin'
              : ((person.roles.charAt(0).toUpperCase() +
                  person.roles.slice(1).toLowerCase()) as keyof typeof Role)
          ];

        await this.userRepository
          .createQueryBuilder()
          .insert()
          .into(User)
          .values({
            name: person.name,
            email: person.email,
            password: await bcrypt.hash(person.password, 10),
            roles: roleEnum,
            phone: person.phone,
            country: person.country,
            address: person.address,
          })
          .orIgnore()
          .execute();
        console.info(`✅${person.name} was added succesfully`);
      }
      console.log(
        `
        Users' database populated successfully from users' custom repo
                      👶🧒👦👧🧑👱👨🧔👨👨👨👩🧑‍🦰
        `,
      );
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
    return await this.userRepository.findOne({ where: { email } });
  }

  async updateUser(id: string, userDto: UpdateUserDto) {
    // Verificar si el usuario existe
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    try {
      // Hashear contraseña si fue incluida en el DTO
      if (userDto.password) {
        const saltRounds = 10; // Ajusta según sea necesario
        userDto.password = await bcrypt.hash(userDto.password, saltRounds);
      }

      // Asignar los campos actualizados al usuario
      Object.assign(user, userDto);

      // Guardar el usuario actualizado en la base de datos
      const updatedUser = await this.userRepository.save(user);

      return updatedUser;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to update user',
        error.message,
      );
    }
  }
  

  async remove(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('No se Enontro el usuario');
    this.userRepository.remove(user);

    return `Usuario con ${user.id} fue eliminado correctamente`;
  }
}
