import { Module,forwardRef} from '@nestjs/common';
import { ClassesController } from './classes.controller';
import { ClassesService } from './classes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Classes } from 'src/database/entities/classes.entity';
import { ClassesCustomRepository } from './classes.repository';
import { ClassSchedule } from 'src/database/entities/ClassSchedule.entity';
import { EmailService } from '../email/email.service';
import { DataSource } from 'typeorm';
import { Trainers } from 'src/database/entities/trainer.entity';
import { EmailModule } from '../email/email.module';
import { TrainersModule } from '../trainers/trainers.module';
import { ScheduleModule } from '../schedule/schedule.module';
import { BookedClassesModule } from '../booked_classes/booked_classes.module';
import { BookedClassesCustomRepository } from '../booked_classes/booked_classes.repository';
import { UsersCustomRepository } from '../users/users.repository';
import { User } from 'src/database/entities/user.entity';
import { ScheduleService } from '../schedule/schedule.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Classes, ClassSchedule,User, Trainers]),
    EmailModule,
    TrainersModule,
  
    forwardRef(() => BookedClassesModule),

    forwardRef(() => ScheduleModule)
  ],
  controllers: [ClassesController],
  providers: [
    ClassesService,
    ClassesCustomRepository,
    EmailService,
    UsersCustomRepository,
   
 
    
  ],
  exports: [ClassesCustomRepository, TypeOrmModule], 
})
export class ClassesModule {}

