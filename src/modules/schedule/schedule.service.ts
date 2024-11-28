import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClassSchedule } from 'src/database/entities/ClassSchedule.entity';
import { Repository } from 'typeorm';
import { CreateClassScheduleDto } from '../classes/dto/createSchedule.dto';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(ClassSchedule)
    private readonly classScheduleRepository: Repository<ClassSchedule>,
  ) {}

  async createSchedule(createClassScheduleDto: CreateClassScheduleDto) {
    const { classId, ...scheduleData } = createClassScheduleDto;
  
    // Crear el horario sin el campo 'class' en el DTO
    const schedule = this.classScheduleRepository.create({
      ...scheduleData,
      class: { id: classId },  // Asociar el horario a la clase por su ID
    });
  
    return await this.classScheduleRepository.save(schedule);
  }
  
  }
