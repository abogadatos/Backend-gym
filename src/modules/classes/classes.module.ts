import { Module } from '@nestjs/common';
import { ClassesController } from './classes.controller';
import { ClassesService } from './classes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Classes } from 'src/database/entities/classes.entity';
import { ClassesCustomRepository } from './classes.repository';
import { Trainers } from 'src/database/entities/trainer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Classes, Trainers])],
  controllers: [ClassesController],
  providers: [ClassesService, ClassesCustomRepository],
  exports: [ClassesCustomRepository],
})
export class ClassesModule {}
