import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/database/entities/user.entity';
import { UsersCustomRepository } from './users.repository';
import { ClassesModule } from '../classes/classes.module';
import { TrainersModule } from '../trainers/trainers.module';
import { MembershipsModule } from '../memberships/memberships.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TrainersModule,
    ClassesModule,
    MembershipsModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersCustomRepository],
  exports: [UsersService],
})
export class UsersModule {}
