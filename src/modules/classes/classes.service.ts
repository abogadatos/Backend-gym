import { Injectable } from '@nestjs/common';
import { ClassesCustomRepository } from './classes.repository';

import { CreateClassDto } from './dto/create-classes.dto';
import { UpdateClassDto } from './dto/update-classes.dto';
import { ScheduleService } from '../schedule/schedule.service';

@Injectable()
export class ClassesService {
  constructor(
    private classesCustomRepository: ClassesCustomRepository,
    private scheduleService: ScheduleService,
  ) {}

  async classesSeeder() {
    return await this.classesCustomRepository.initializeClasses();
  }

  getAllClasses() {
    return this.classesCustomRepository.getAllClasses();
  }
  getClassByID(id: string) {
    return this.classesCustomRepository.getClassById(id);
  }
  createClass(createClassDto: CreateClassDto) {
    return this.classesCustomRepository.createClass(createClassDto);
  }
  updateClass(id: string, classe: UpdateClassDto) {
    return this.classesCustomRepository.updateClass(id, classe);
  }
  deleteClass(id: string) {
    return this.classesCustomRepository.deleteClass(id);
  }
}
