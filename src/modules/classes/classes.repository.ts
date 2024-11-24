import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Classes } from 'src/database/entities/classes.entity';
import { Trainers } from 'src/database/entities/trainer.entity';
import { Repository, DataSource } from 'typeorm';
import * as data from '../../utils/mockeClass.json';

@Injectable()
export class ClassesCustomRepository {
  constructor(
    @InjectRepository(Classes)
    private classesRepository: Repository<Classes>,
    @InjectRepository(Trainers)
    private readonly trainerRepository: Repository<Trainers>,
    private readonly dataSource: DataSource,
  ) {}

  async initializeClasses() {
    const trainers = await this.dataSource
      .getRepository('Trainers')
      .createQueryBuilder('trainers')
      .leftJoinAndSelect('trainers.userID', 'user')
      .getMany();

    for (const person of data) {
      const trainer = trainers.find(
        (t) => `${t.userID.name}` === person.trainerName,
      );

      const trainerId = trainer ? trainer.id : null;
      const trainerName = trainer ? trainer.userID.name : 'Sin entrenador';

      await this.classesRepository
        .createQueryBuilder()
        .insert()
        .into('classes')
        .values({
          name: person.name,
          description: person.description,
          location: person.location,
          capacity: person.capacity,
          current_participants: person.current_participants || 0,
          schedule: new Date(person.schedule),
          imgUrl: person.imgUrl || null,
          created_at: new Date(),
          update_at: new Date(),
          trainer: trainerId,
        })
        .orIgnore()
        .execute();

      console.log(
        `Clase "${person.name}" creada con ${
          trainer ? `entrenador ${trainerName}` : '"Sin entrenador"'
        }.`,
      );
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
