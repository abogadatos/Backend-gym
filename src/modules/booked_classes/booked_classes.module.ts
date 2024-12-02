import { Module,forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookedClasses } from 'src/database/entities/booked_classes.entity';
import { BookedClassesController } from './booked_classes.controller';
import { BookedClassesService } from './booked_classes.service';
import { BookedClassesCustomRepository } from './booked_classes.repository';
import { Classes } from 'src/database/entities/classes.entity';
import { User } from 'src/database/entities/user.entity';
import { EmailService } from '../email/email.service';
import { ClassSchedule } from 'src/database/entities/ClassSchedule.entity';
import { EmailModule } from '../email/email.module';
import { ClassesModule } from '../classes/classes.module';
import { ClassesCustomRepository } from '../classes/classes.repository';
import { ScheduleModule } from '../schedule/schedule.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BookedClasses, Classes, User, ClassSchedule]),
    EmailModule, 
    forwardRef(() => ClassesModule),
    
  ],
  controllers: [BookedClassesController],
  providers: [
    BookedClassesService,

    BookedClassesCustomRepository,
   
  ],
  exports: [BookedClassesCustomRepository], 
})
export class BookedClassesModule {}
