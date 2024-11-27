import { Injectable,NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookedClasses } from 'src/database/entities/booked_classes.entity';
import { Classes } from 'src/database/entities/classes.entity';
import { User } from 'src/database/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateBookedClassDto } from './dto/createBookedDto';
import { EmailService } from '../email/email.service';
import { Status } from 'src/enum/bookingStatus.enum';
import { ClassSchedule } from 'src/database/entities/ClassSchedule.entity';

@Injectable()
export class BookedClassesCustomRepository {
  constructor(
    private readonly emailService:EmailService,
    @InjectRepository(BookedClasses)
    private readonly bookedClassesRepository: Repository<BookedClasses>,

    @InjectRepository(User)
    private readonly usersRepostory:Repository<User>,

    @InjectRepository(ClassSchedule)
    private readonly classScheduleRepository:Repository<ClassSchedule>,

    @InjectRepository(Classes)
    private readonly classRepository:Repository<Classes>
  ) {}

  async getAllBookedClasses() {
    return await this.bookedClassesRepository.find({ relations: ['user', 'class'] });
  }

  async getBookedClassById(id:string) {
    const bookedClass = await this.bookedClassesRepository.findOne({ where: { id }, relations: ['user', 'class'] });
  if (!bookedClass) {
    throw new NotFoundException(`Reserva con ID ${id} no encontrada.`);
  }
  return bookedClass;
}
  

async createBooked(bookClass: CreateBookedClassDto) {
  const { userId, classId, scheduleId } = bookClass
    const classEntity = await this.classRepository.findOne({
      where: { id: classId },
      relations: ['schedules'],
    });
  
    if (!classEntity) throw new NotFoundException('Class not found');
  
    
    const availableSchedule = classEntity.schedules.find(
      (schedule) => schedule.remainingCapacity > 0
    );
  
    if (!availableSchedule) {
      throw new Error('No remaining capacity in any schedule');
    }
  
    const newBookedClass = this.bookedClassesRepository.create({
      user: { id: userId }, 
      schedule: availableSchedule,
      class: classEntity,
    });
  
    
    await this.bookedClassesRepository.save(newBookedClass);
  
    
    availableSchedule.remainingCapacity -= 1;
  
  
    await this.classScheduleRepository.save(availableSchedule);
  
    return classEntity;
  
}  

async deleteBooked(bookingId: string) {
  const booking = await this.bookedClassesRepository.findOne({
    where: { id: bookingId },
    relations: ['user', 'class', 'class.schedules'],
    
  });

  if (!booking) {
    throw new BadRequestException('No se encontró la reserva.');
  }


  const classSchedule = booking.class.schedules[0];
  if (!classSchedule) {
    throw new BadRequestException('La clase no tiene un horario asignado.');
  }

  const classDate = new Date(`${classSchedule.day}T${classSchedule.startTime}`);

  await this.bookedClassesRepository.save(booking);

  await this.emailService.sendCancellationEmail(
    booking.user.email,
    booking.class.name,
    classDate,  
  );

  
  return booking;
}



  async getBooketsByUserId(userId:string) {
    return await this.bookedClassesRepository.find({
      where: { user: { id: userId } },
      relations: ['class'],
    });
  }

  async getBooketsByclassId(classId:string) {
    return await this.bookedClassesRepository.find({
      where: { class: { id: classId } },
      relations: ['user'],
    });
  }
}



