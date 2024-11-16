import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/database/entities/user.entity';
import { UsersCustomRepository } from './users.repository';
import { ClassesModule } from '../classes/classes.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), ClassesModule],
  controllers: [UsersController],
  providers: [UsersService, UsersCustomRepository],
  exports: [UsersService],
})
export class UsersModule {}
