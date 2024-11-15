import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Classes } from 'src/database/entities/classes.entity';
import { ClassesCustomRepository } from './classes.repository';

@Injectable()
export class ClassesService {
  constructor(
    @InjectRepository(Classes)
    private classesCustomRepository: ClassesCustomRepository,
  ) {}
  getAllBookedClasses(){
    return this.classesCustomRepository.getAllBookedClasses();
  }

  
}
