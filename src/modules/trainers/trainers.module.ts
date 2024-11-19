import { Module } from '@nestjs/common';
import { TrainersController } from './trainers.controller';
import { TrainersService } from './trainers.service';
import { TrainersCustomRepository } from './trainers.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/database/entities/user.entity';
import { Trainers } from 'src/database/entities/trainer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Trainers, User])],
  controllers: [TrainersController],
  providers: [TrainersService, TrainersCustomRepository],
  exports: [TrainersCustomRepository],
})
export class TrainersModule {}
