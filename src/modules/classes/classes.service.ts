import { Injectable } from '@nestjs/common';
import { Classes } from 'src/database/entities/classes.entity';
import { ClassesCustomRepository } from './classes.repository';
import { UpdateClassDto } from './dto/update-classes.dto';
import { CreateClassDto } from './dto/create-classes.dto';

@Injectable()
export class ClassesService {
  constructor(private classesCustomRepository: ClassesCustomRepository) {}

  async classesSeeder() {
    return await this.classesCustomRepository.initializeClasses();
  }

  getAllClasses(page: number, limit: number) {
    return this.classesCustomRepository.getAllClasses(page, limit);
  }
  getClassByID(id: string) {
    return this.classesCustomRepository.getClassById(id);
  }
  createClass(createClassDto:CreateClassDto) {
    return this.classesCustomRepository.createClass(createClassDto);
  }
  updateClass(id: string, classe: UpdateClassDto) {
    return this.classesCustomRepository.updateClass(id, classe);
  }
  deleteClass(id: string) {
    return this.classesCustomRepository.deleteClass(id);
  }
}
