import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookedClasses } from 'src/database/entities/booked_classes.entity';
import { BookedClassesController } from './booked_classes.controller';
import { BookedClassesService } from './booked_classes.service';
import { BookedClassesCustomRepository } from './booked_classes.repository';
import { Classes } from 'src/database/entities/classes.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BookedClasses, Classes])],
  controllers: [BookedClassesController],
  providers: [BookedClassesService, BookedClassesCustomRepository],
  exports: [],
})
export class BookedClassesModule {}
