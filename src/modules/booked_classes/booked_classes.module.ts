import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookedClasses } from 'src/database/entities/booked_classes.entity';
import { BookedClassesController } from './booked_classes.controller';
import { BookedClassesService } from './booked_classes.service';
import { BookedClassesCustomRepository } from './booked_classes.repository';
import { Classes } from 'src/database/entities/classes.entity';
import { User } from 'src/database/entities/user.entity';
import { EmailService } from '../email/email.service';

@Module({
  imports: [TypeOrmModule.forFeature([BookedClasses, Classes,User])],
  controllers: [BookedClassesController],
  providers: [BookedClassesService, BookedClassesCustomRepository,EmailService],
  exports: [],
})
export class BookedClassesModule {}
