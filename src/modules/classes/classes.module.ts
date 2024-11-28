import { Module } from '@nestjs/common';
import { ClassesController } from './classes.controller';
import { ClassesService } from './classes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Classes } from 'src/database/entities/classes.entity';
import { ClassesCustomRepository } from './classes.repository';
import { ClassSchedule } from 'src/database/entities/ClassSchedule.entity';
import { EmailService } from '../email/email.service';
import { DataSource } from 'typeorm';
import { Trainers } from 'src/database/entities/trainer.entity';
import { TrainersCustomRepository } from '../trainers/trainers.repository';
import { UsersCustomRepository } from '../users/users.repository';
import { EmailModule } from '../email/email.module';
import { TrainersModule } from '../trainers/trainers.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Classes, ClassSchedule, Trainers]),
    EmailModule,
    TrainersModule,
  ],
  controllers: [ClassesController],
  providers: [
    ClassesService,
    ClassesCustomRepository,
    EmailService,
    
  ],
  exports: [ClassesCustomRepository, TypeOrmModule], 
})
export class ClassesModule {}

