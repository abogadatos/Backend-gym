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
import { ScheduleService } from '../schedule/schedule.service';

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

  async createClass(createClassDto: CreateClassDto): Promise<Classes> {
    const { schedules, trainerId, ...classData } = createClassDto;

   
    const newClass = this.classesRepository.create({
      ...classData,
      trainer: { id: trainerId }, 
    });

    
    const savedClass = await this.classesRepository.save(newClass);

    if (schedules && schedules.length > 0) {
      const scheduleEntities = schedules.map((schedule) =>
        this.classScheduleRepository.create({
          ...schedule,
          remainingCapacity: createClassDto.capacity,
          class: savedClass, 
        }),
      );

      
      await this.classScheduleRepository.save(scheduleEntities);
    }

 
    return this.classesRepository.findOne({
      where: { id: savedClass.id },
      relations: ['schedules', 'trainer','reviews'],
    });
  }


  async updateClass(id: string, updateClassDto: UpdateClassDto): Promise<Classes> {
  const { scheduleClass, ...updates } = updateClassDto;


  const classEntity = await this.classesRepository.findOne({
    where: { id },
    relations: ['schedules', 'bookedClasses', 'bookedClasses.user'],
  });

  if (!classEntity) throw new NotFoundException('Class not found');

  const previousSchedules = JSON.stringify(classEntity.schedules);

  Object.assign(classEntity, updates);

  if (scheduleClass) {
    
    const existingSchedules = classEntity.schedules.map((sch) => sch.id);
    const incomingSchedules = scheduleClass.map((sch) => sch.id).filter(Boolean);


    const schedulesToDelete = existingSchedules.filter(
      (id) => !incomingSchedules.includes(id),
    );

    if (schedulesToDelete.length > 0) {
      await this.classScheduleRepository.delete(id);
    }


    classEntity.schedules = await Promise.all(
      scheduleClass.map((schedule) => {
        if (schedule.id) {
          
          return this.classScheduleRepository.save({
            ...schedule,
            class: { id },
          });
        } else {
         
          return this.classScheduleRepository.save(
            this.classScheduleRepository.create({ ...schedule, class: { id } }),
          );
        }
      }),
    );
  }


  const updatedClass = await this.classesRepository.save(classEntity);


  const newSchedules = JSON.stringify(classEntity.schedules);
  const schedulesChanged = previousSchedules !== newSchedules;

 
  if (schedulesChanged && classEntity.bookedClasses.length > 0) {
    const recipients = classEntity.bookedClasses.map(
      (booking) => booking.user.email,
    );

    const newScheduleDetails = classEntity.schedules
      .map(
        (schedule) =>
          `Día: ${schedule.day}, desde ${schedule.startTime} hasta ${schedule.endTime}`,
      )
      .join('<br>');

    await this.emailService.sendClassUpdateEmail(
      recipients,
      updatedClass.name,
      newScheduleDetails,
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
