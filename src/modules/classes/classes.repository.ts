import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Classes } from 'src/database/entities/classes.entity';
import { Trainers } from 'src/database/entities/trainer.entity';
import { Repository } from 'typeorm';
import * as data from '../../utils/mockeClass.json';

@Injectable()
export class ClassesCustomRepository {
  constructor(
    @InjectRepository(Classes)
    private classesRepository: Repository<Classes>,
    @InjectRepository(Trainers)
    private readonly trainerRepository: Repository<Trainers>,
  ) {}

  async initializeClasses() {
    const trainers = await this.trainerRepository.find({
      relations: ['userID'],
    });

    for (const person of data) {
      const trainer = trainers.find(
        (t) => `${t.userID.name}` === person.trainerName,
      );

      if (!trainer) {
        console.warn(`Trainer no encontrado para ${person.trainerName}`);
        continue;
      }

      const newClass = new Classes();
      newClass.name = person.name;
      newClass.description = person.description;
      newClass.location = person.location;
      newClass.capacity = person.capacity;
      newClass.current_participants = person.current_participants;
      newClass.schedule = new Date(person.schedule);
      newClass.imgUrl = person.imgUrl || null;
      newClass.created_at = new Date();
      newClass.update_at = new Date();
      newClass.trainer = trainer;

      await this.classesRepository.save(newClass);
      console.log(`Clase "${person.name}" agregada correctamente.`);
    }
  }

  async getAllClasses(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const classes = await this.classesRepository.find({
      take: limit,
      skip: skip,
    });
    return classes;
  }

  async getClassById(id: string) {
    const classe = await this.classesRepository.findOne({ where: { id } });
    return classe;
  }

  async createClass(classe: Partial<Classes>) {
    const newClass = await this.classesRepository.save(classe);
    return newClass;
  }

  async updateClass(id: string, classe: Partial<Classes>) {
    const existingClass = await this.classesRepository.findOne({
      where: { id },
    });

    if (!existingClass) {
      throw new NotFoundException('Class not found');
    }

    const updatedClass = this.classesRepository.merge(existingClass, classe);
    await this.classesRepository.save(updatedClass);

    return updatedClass;
  }

  async deleteClass(id: string) {
    const classe = await this.classesRepository.findOneBy({ id });
    if (!classe) throw new NotFoundException('Class not found');
    this.classesRepository.remove(classe);
    return `Class ${id} was successfully deleted `;
  }
}
