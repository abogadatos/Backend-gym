import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleService } from './schedule.service';
import { ClassSchedule } from 'src/database/entities/ClassSchedule.entity';
import { ScheduleController } from './schedule.controller';
import { ClassesModule } from '../classes/classes.module';
import { BookedClassesModule } from '../booked_classes/booked_classes.module';
import { BookedClassesCustomRepository } from '../booked_classes/booked_classes.repository';
import { ClassesService } from '../classes/classes.service';
import { EmailModule } from '../email/email.module';
import { BookedClasses } from 'src/database/entities/booked_classes.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClassSchedule, BookedClasses]),
    BookedClassesModule,
    EmailModule,
    forwardRef(() => ClassesModule),
  ],
  providers: [ScheduleService, BookedClassesCustomRepository, ClassesService],
  controllers: [ScheduleController],
  exports: [ScheduleService],
})
export class ScheduleModule {}
