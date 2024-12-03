import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClassSchedule } from 'src/database/entities/ClassSchedule.entity';
import { Repository } from 'typeorm';
import { CreateClassScheduleDto } from './dto/createSchedule.dto';
import { UpdateClassScheduleDto } from './dto/updateSchedule.dto';
import { BookedClassesCustomRepository } from '../booked_classes/booked_classes.repository';
import { Classes } from 'src/database/entities/classes.entity';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(ClassSchedule)
    private readonly scheduleRepository: Repository<ClassSchedule>,
    private readonly bookedClassesRepository: BookedClassesCustomRepository,
  ) {}

  async createSchedule(
    schedules: CreateClassScheduleDto[],
    classEntity: Classes,
  ): Promise<ClassSchedule[]> {
    const scheduleEntities = schedules.map((schedule) =>
      this.scheduleRepository.create({
        ...schedule,
        class: classEntity,
        currentParticipants: 0,
        remainingCapacity: classEntity.capacity,
      }),
    );

    return this.scheduleRepository.save(scheduleEntities);
  }

  async updateSchedule(id: string, updateScheduleDto: UpdateClassScheduleDto) {
    const schedule = await this.scheduleRepository.findOne({ where: { id } });

    if (!schedule) {
      throw new Error('Horario no encontrado');
    }

    if (updateScheduleDto.day) {
      schedule.day = updateScheduleDto.day;
    }
    if (updateScheduleDto.startTime) {
      schedule.startTime = updateScheduleDto.startTime;
    }
    if (updateScheduleDto.endTime) {
      schedule.endTime = updateScheduleDto.endTime;
    }

    return this.scheduleRepository.save(schedule);
  }

  async deleteSchedule(scheduleId: string): Promise<void> {
    const schedule = await this.scheduleRepository.findOne({
      where: { id: scheduleId },
      relations: ['bookedClasses'],
    });

    if (!schedule) {
      throw new Error('Horario no encontrado');
    }

    if (schedule.bookedClasses && schedule.bookedClasses.length > 0) {
      for (const booking of schedule.bookedClasses) {
        await this.bookedClassesRepository.deleteBooked(booking.id);
      }
    }

    await this.scheduleRepository.remove(schedule);
  }
}
