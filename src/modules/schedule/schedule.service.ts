import { Injectable,NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClassSchedule } from 'src/database/entities/ClassSchedule.entity';
import { Repository } from 'typeorm';
import { CreateClassScheduleDto } from './dto/createSchedule.dto';
import { UpdateClassScheduleDto } from './dto/updateSchedule.dto';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(ClassSchedule)
    private readonly classScheduleRepository: Repository<ClassSchedule>,
  ) {}

  async createSchedule(createClassScheduleDto: CreateClassScheduleDto) {
    const { classId, ...scheduleData } = createClassScheduleDto;
  
  
    const schedule = this.classScheduleRepository.create({
      ...scheduleData,
      class: { id: classId }, 
    });
  
    return await this.classScheduleRepository.save(schedule);
  }
  async updateSchedules(classId: string, schedules: UpdateClassScheduleDto[]) {
    const existingSchedules = await this.classScheduleRepository.find({
      where: { class: { id: classId } },
    });
  
    const incomingIds = schedules.map((sch) => sch.id).filter((id) => id);
    const schedulesToDelete = existingSchedules.filter(
      (sch) => !incomingIds.includes(sch.id),
    );
  
   
    if (schedulesToDelete.length > 0) {
      await this.classScheduleRepository.remove(schedulesToDelete);
    }
  
    const updatedOrCreatedSchedules = schedules.map(async (sch) => {
      if (sch.id) {
        
        return this.classScheduleRepository.save({
          ...sch,
          class: { id: classId },
        });
      } else {
     
        return this.classScheduleRepository.save(
          this.classScheduleRepository.create({ ...sch, class: { id: classId } }),
        );
      }
    });
  
    return Promise.all(updatedOrCreatedSchedules);
  }

  async deleteSchedule(scheduleId: string) {

    const schedule = await this.classScheduleRepository.findOne({
      where: { id: scheduleId },
    });

    if (!schedule) {
      throw new NotFoundException('Schedule not found');
    }


    await this.classScheduleRepository.remove(schedule);
  }

  }
