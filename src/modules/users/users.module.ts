import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/database/entities/user.entity';
import { UsersCustomRepository } from './users.repository';
import { ClassesModule } from '../classes/classes.module';
import { TrainersModule } from '../trainers/trainers.module';
import { MembershipsModule } from '../memberships/memberships.module';
import { PaymentsModule } from '../payments/payments.module';
import { ReviewsModule } from '../reviews/reviews.module';
import { RoutinesModule } from '../routines/routines.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UsersCustomRepository]),
    forwardRef(() => TrainersModule),
    ClassesModule,
    MembershipsModule,
    forwardRef(() => ReviewsModule),
    forwardRef(() => PaymentsModule),
    forwardRef(() => RoutinesModule),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersCustomRepository],
  exports: [UsersService, UsersCustomRepository, TypeOrmModule],
})
export class UsersModule {}
