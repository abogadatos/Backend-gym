import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/entities/user.entity';
import { Repository } from 'typeorm';
import { TrainersCustomRepository } from '../trainers/trainers.repository';
import { ClassesCustomRepository } from './../classes/classes.repository';
import { MembershipsCustomRepository } from './../memberships/memberships.repository';
import { UpdateUserDto } from './dto/updateUser.dto';
import { UserWithoutPassword } from './types/userWithoutPassword.type';
import { UsersCustomRepository } from './users.repository';
import * as bcrypt from 'bcrypt';
import { PaymentsCustomRepository } from '../payments/payments.repository';
import { ReviewsService } from '../reviews/reviews.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private usersCustomRepository: UsersCustomRepository,
    private trainersCustomRepository: TrainersCustomRepository,
    private classesCustomRepository: ClassesCustomRepository,
    private membershipsCustomRepository: MembershipsCustomRepository,
    private paymentsCustomRepository: PaymentsCustomRepository,
    private reviewsCustomService: ReviewsService,
  ) {}

  async seedDatabase() {
    setTimeout(() => {
      console.info('Seeding your database');
    }, 200);

    setTimeout(() => {
      console.info(`
            Seeding memberships
                💎💎💎💎💎
            `);
    }, 500);
    setTimeout(() => {
      this.membershipsCustomRepository.addMemberships();
    }, 700);

    setTimeout(() => {
      console.info(`
              Seeding users
                👧🧑👱👨
          `);
    }, 1500);
    setTimeout(() => {
      this.userSeeder();
    }, 1700);

    setTimeout(() => {
      console.info(`
          Seeding trainers
            🏃🏽💥🏋‍♀🔥💪🏼
          `);
    }, 9000);
    setTimeout(() => {
      this.trainersCustomRepository.initializeTrainers();
    }, 9200);

    setTimeout(() => {
      console.info(`
          Seeding class
           ⏳⏳⏳⏳⌛
          `);
    }, 12000);
    setTimeout(() => {
      this.classesCustomRepository.initializeClasses();
    }, 12500);

    setTimeout(() => {
      console.info(
          `Seeding reviews
           ⏳⏳⏳⏳⌛
          `);
    }, 12000);
    setTimeout(() => {
      this.reviewsCustomService.initializeReviews();
    }, 12500);


    setTimeout(() => {
      console.info(`
              Database seeding completed
                ✅✅✅✅✅✅✅✅✅✅
          `);
    }, 14000);
  }

  async userSeeder() {
    return await this.usersCustomRepository.initializeUser();
  }

  async getUsers(
    page: number,
    limit: number,
    sortBy: string,
    order: 'ASC' | 'DESC',
  ) {
    const [users, total] = await this.usersRepository
      .createQueryBuilder('users')
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy(sortBy, order)
      .getManyAndCount();

    const totalPages = Math.ceil(total / limit);
    const hasPrevPage = page > 1;
    const hasNextPage = page < totalPages;
    const prevPage = hasPrevPage ? page - 1 : null;
    const nextPage = hasNextPage ? page + 1 : null;

    return {
      users,
      sortedBy: sortBy,
      ordered: order,
      totalElements: total,
      page,
      limit,
      totalPages,
      hasPrevPage,
      hasNextPage,
      prevPage,
      nextPage,
    };
  }

  async updateUser(userID: string, userInfo: UpdateUserDto) {
    const foundUser = await this.usersRepository.findOne({
      where: { id: userID },
    });
    if (!foundUser) throw new NotFoundException('user not found or not exist');

    if (foundUser.auth === 'form') {
      const hashedPassword = await bcrypt.hash(userInfo.password, 10);

      const updatedUser = this.usersRepository.merge(foundUser, userInfo);
      updatedUser.password = hashedPassword;
      const userData = await this.usersRepository.save(updatedUser);

      return { message: 'User Updated Successfully', userData };
    } else if (foundUser.auth === 'googleIncomplete') {
      if (
        foundUser.password === null ||
        foundUser.phone === null ||
        foundUser.country === null ||
        foundUser.address === null
      ) {
        const hashedPassword = await bcrypt.hash(userInfo.password, 10);
        userInfo.password = hashedPassword;

        const updatedUser = this.usersRepository.merge(foundUser, userInfo);
        updatedUser.auth = 'google';
        const userData = await this.usersRepository.save(updatedUser);

        return { message: 'User Updated Successfully', userData };
      }
    } else if (foundUser.auth === 'google') {
      const hashedPassword = await bcrypt.hash(userInfo.password, 10);

      userInfo.password = hashedPassword;
      const updatedUser = this.usersRepository.merge(foundUser, userInfo);

      const userData = await this.usersRepository.save(updatedUser);

      return { message: 'User Updated Successfully', userData };
    }
  }

  async getUserById(userID: string): Promise<UserWithoutPassword> {
    const foundUser: User | undefined = await this.usersRepository.findOne({
      where: { id: userID },
    });
    if (!foundUser) throw new NotFoundException('user not found or not exist');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...filteredUser } = foundUser;
    return foundUser;
  }

  async getUserByEmail(email: string): Promise<User> {
    try {
      const user = await this.usersRepository.findOne({
        where: { email },
        relations: ['payments'], // Obtener todas las relaciones, si es necesario
      });

      if (!user) {
        throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
      }

      return user;
    } catch (error) {
      throw new HttpException(
        'Error al buscar el usuario',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteUser(id: string): Promise<Partial<User>> {
    const user = await this.usersRepository.findOneBy({ id });
    this.usersRepository.remove(user);
    // const { password, ...userWithoutPass } = user;

    return user;
  }
}
