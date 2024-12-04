import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Classes } from 'src/database/entities/classes.entity';
import { Trainers } from 'src/database/entities/trainer.entity';
import { Repository, DataSource } from 'typeorm';
import * as data from '../../utils/mockeClass.json';
import { CreateClassDto } from './dto/create-classes.dto';
import { ClassSchedule } from 'src/database/entities/ClassSchedule.entity';
import { TrainersCustomRepository } from '../trainers/trainers.repository';

import { EmailService } from '../email/email.service';
import { ScheduleService } from '../schedule/schedule.service';
import { BookedClassesCustomRepository } from '../booked_classes/booked_classes.repository';
import { UpdateClassDto } from './dto/update-classes.dto';

@Injectable()
export class ClassesCustomRepository {
  constructor(
    @InjectRepository(Classes)
    private classesRepository: Repository<Classes>,
   private readonly emailService:EmailService,
    private readonly trainerRepository:TrainersCustomRepository,
    @InjectRepository(ClassSchedule)
    private readonly classScheduleRepository:Repository<ClassSchedule>,
    private readonly scheduleService: ScheduleService,
    private readonly bookedClassRepository:BookedClassesCustomRepository,

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
  
     
      const trainerName = trainer ? trainer.id : null;
  
      // Crear la clase
      const newClass = await this.classesRepository
        .createQueryBuilder()
        .insert()
        .into('classes')
        .values({
          name: person.name,
          description: person.description,
          location: person.location,
          capacity: person.capacity,
          imgUrl: person.imgUrl,
          created_at: new Date(),
          update_at: new Date(),
          trainer: trainerName,
        })
        .orIgnore()
        .execute();
  
      if (person.schedule && person.schedule.length > 0) {
        for (const schedule of person.schedule) {
          await this.classScheduleRepository
            .createQueryBuilder()
            .insert()
            .into('ClassSchedule')
            .values({
              day: schedule.day,
              startTime: schedule.startTime,
              endTime: schedule.endTime,
              currentParticipants: 0,
              remainingCapacity: person.capacity, 
              class: newClass.identifiers[0].id, 
            })
            .orIgnore()
            .execute();
        }
      }
  
      console.log(
        `Clase "${person.name}" creada con ${
          trainer ? `entrenador UUID ${trainerName}` : '"Sin entrenador"'
        }.`,
      );
    }
  }
  
  async getAllClasses() {
   
      const classe = await this.classesRepository.findAndCount({
        relations: ['schedules', 'trainer', 'bookedClasses','reviews'], 
      
      });
    
    return classe
       
  }

  async getClassById(id: string) {
    const classe = await this.classesRepository.findOne({
      where: { id },
      relations: ['schedules', 'trainer', 'bookedClasses','reviews'],
    });
  
    if (!classe) {
      throw new NotFoundException(`Class with ID "${id}" not found`);
    }
  
    return classe;
  }

  async createClass(createClassDto: CreateClassDto){
  
   
    const { name,schedules, trainerId, ...classData } = createClassDto;

    const existingClass = await this.classesRepository.findOne({
      where: { name: name },
    });

  if (existingClass) throw new BadRequestException(`There's already a class with the name ${name}`)

  let trainer = null;
  if (trainerId) {
    trainer = await this.trainerRepository.getTrainerById(trainerId);
    if (!trainer) {
      throw new Error('El entrenador especificado no existe.');
    }
  }


  const newClass = this.classesRepository.create({
    name,
    ...classData,
    trainer,
  });


  const savedClass = await this.classesRepository.save(newClass);

 
  if (schedules && schedules.length > 0) {
    await this.scheduleService.createSchedule(schedules, savedClass);
  }


  return this.classesRepository.findOne({
    where: { id: savedClass.id },
    relations: ['schedules', 'trainer', 'reviews'],
  });
}
 async updateClass(id: string, updateClassDto: UpdateClassDto): Promise<Classes> {
    const classToUpdate = await this.classesRepository.findOne({
      where: { id },
      relations: ['schedules', 'bookedClasses','trainer'],
    });
  
    if (!classToUpdate) {
      throw new Error('Clase no encontrada');
    }
  
   
    if (updateClassDto.name) classToUpdate.name = updateClassDto.name;
    if (updateClassDto.description) classToUpdate.description = updateClassDto.description;
    if (updateClassDto.location) classToUpdate.location = updateClassDto.location;
    if (updateClassDto.imgUrl) classToUpdate.imgUrl = updateClassDto.imgUrl;
  
    if (updateClassDto.capacity) {
      classToUpdate.capacity = updateClassDto.capacity;
  
   
      for (const schedule of classToUpdate.schedules) {
        schedule.remainingCapacity = classToUpdate.capacity - schedule.currentParticipants;
        
        await this.classScheduleRepository.save(schedule);
      }
    }
  
  
    if (updateClassDto.trainerId) {
      const trainer = await this.trainerRepository.getTrainerById(updateClassDto.trainerId);
  
      if (!trainer) {
        throw new NotFoundException('Entrenador no encontrado');
      }
  
      classToUpdate.trainer = trainer;
    }
  
   
    if (Array.isArray(updateClassDto.schedules)) {
      for (const schedule of updateClassDto.schedules) {
        const existingSchedule = classToUpdate.schedules.find(s => s.id === schedule.id);
  
        if (existingSchedule) {
          
          existingSchedule.day = schedule.day ?? existingSchedule.day;
          existingSchedule.startTime = schedule.startTime ?? existingSchedule.startTime;
          existingSchedule.endTime = schedule.endTime ?? existingSchedule.endTime;
  
        
          existingSchedule.remainingCapacity = classToUpdate.capacity - existingSchedule.currentParticipants;
          
       
          await this.classScheduleRepository.save(existingSchedule);
        } else {
       
          const newSchedule = this.classScheduleRepository.create({
            ...schedule,
            class: classToUpdate,
            currentParticipants: 0,
            remainingCapacity: classToUpdate.capacity,
          });
          await this.classScheduleRepository.save(newSchedule);
        }
      }
    }

   return await this.classesRepository.save(classToUpdate)
  
  }
  
  async deleteClass(id: string) {
    
      const classEntity = await this.classesRepository.findOne({
        where: { id },
        relations: ['bookedClasses', 'bookedClasses.user'],
      });
    
      if (!classEntity) throw new NotFoundException('Class not found');
    
      const recipients = classEntity.bookedClasses.map((booking) => booking.user.email);
    
      if (recipients.length > 0) {
        await this.emailService.sendClassCancellationEmail(recipients, classEntity.name);
      }
    
      await this.classesRepository.delete({ id });
    }
}
