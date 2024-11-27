import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Classes } from 'src/database/entities/classes.entity';
import { Trainers } from 'src/database/entities/trainer.entity';
import { Repository, DataSource } from 'typeorm';
import * as data from '../../utils/mockeClass.json';
import { CreateClassDto } from './dto/create-classes.dto';
import { ClassSchedule } from 'src/database/entities/ClassSchedule.entity';
import { TrainersCustomRepository } from '../trainers/trainers.repository';
import { UpdateClassDto } from './dto/update-classes.dto';
import { EmailService } from '../email/email.service';

@Injectable()
export class ClassesCustomRepository {
  constructor(
    @InjectRepository(Classes)
    private classesRepository: Repository<Classes>,
   private readonly emailService:EmailService,
    private readonly trainerRepository:TrainersCustomRepository,
    @InjectRepository(ClassSchedule)
    private readonly classScheduleRepository:Repository<ClassSchedule>,

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
        (t) => `${t.userID.name}` === person.trainerId,
      );
  
      const trainerId = trainer ? trainer.id : null;
      const trainerName = trainer ? trainer.userID.name : 'Sin entrenador';
  
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
          trainer: trainerId,
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
          trainer ? `entrenador UUID ${trainerId}` : '"Sin entrenador"'
        }.`,
      );
    }
  }
  
  async getAllClasses(page: number, limit: number) {
    const skip = (page - 1) * limit;
      const [data,total] = await this.classesRepository.findAndCount({
        relations: ['schedules', 'trainer', 'bookedClasses'], 
        skip,
        take:limit,
      });
    
    return {data,total}
       
  }

  async getClassById(id: string) {
    const classe = await this.classesRepository.findOne({
      where: { id },
      relations: ['schedules', 'trainer', 'bookedClasses'],
    });
  
    if (!classe) {
      throw new NotFoundException(`Class with ID "${id}" not found`);
    }
  
    return classe;
  }

  async createClass(createClassDto:CreateClassDto) {
    const{trainerId,scheduleClass,...classData}=createClassDto

    const trainer= await this.trainerRepository.getTrainerById(trainerId)

    const newClass= await this.classesRepository.create({
      ...classData,
      trainer
    })

    if (scheduleClass && scheduleClass.length > 0) {
      newClass.schedules = scheduleClass.map((schedule) => 
        this.classScheduleRepository.create({
          day: schedule.day,
          startTime: schedule.startTime,
          endTime: schedule.endTime,
          currentParticipants: schedule.currentParticipants || 0,
          class: newClass, 
        })
      );
    }

    return await this.classesRepository.save(newClass)
  }

  async updateClass(id: string, updateClassDto: UpdateClassDto): Promise<Classes> {
    const { scheduleClass, ...updates } = updateClassDto;
  
   
    const classEntity = await this.classesRepository.findOne({
      where: { id },
      relations: ['schedules', 'bookedClasses', 'bookedClasses.user'],
    });
  
    if (!classEntity) throw new NotFoundException('Class not found');
  
   
    const previousSchedules = classEntity.schedules;
  
 
    Object.assign(classEntity, updates);
  

    if (scheduleClass) {
      await this.classScheduleRepository.delete({ class: { id } });
      classEntity.schedules = scheduleClass.map((schedule) =>
        this.classScheduleRepository.create(schedule),
      );
    }
  

    const updatedClass = await this.classesRepository.save(classEntity);
  
    const schedulesChanged = JSON.stringify(previousSchedules) !== JSON.stringify(classEntity.schedules);
  
 
    if (schedulesChanged && classEntity.bookedClasses.length > 0) {
      const recipients = classEntity.bookedClasses.map((booking) => booking.user.email);
  
      const newSchedule = classEntity.schedules.map(
        (schedule) =>
          `Día: ${schedule.day}, desde ${schedule.startTime} hasta ${schedule.endTime}`,
      ).join('<br>');
  
      await this.emailService.sendClassUpdateEmail(
        recipients,
        updatedClass.name,
        newSchedule,
      );
    }
  
    return updatedClass;
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
