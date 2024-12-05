import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookedClasses } from 'src/database/entities/booked_classes.entity';
import { Classes } from 'src/database/entities/classes.entity';
import { User } from 'src/database/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateBookedClassDto } from './dto/createBookedDto';
import { EmailService } from '../email/email.service';
import { ClassSchedule } from 'src/database/entities/ClassSchedule.entity';

@Injectable()
export class BookedClassesCustomRepository {
  constructor(
    private readonly emailService: EmailService,
    @InjectRepository(BookedClasses)
    private readonly bookedClassesRepository: Repository<BookedClasses>,

    @InjectRepository(User)
    private readonly usersRepostory: Repository<User>,

    @InjectRepository(ClassSchedule)
    private readonly classScheduleRepository: Repository<ClassSchedule>,

    @InjectRepository(Classes)
    private readonly classRepository: Repository<Classes>,
  ) {}

  async getAllBookedClasses() {
    return await this.bookedClassesRepository.find({
      relations: ['user', 'class'],
    });
  }

  async getBookedClassById(id: string) {
    const bookedClass = await this.bookedClassesRepository.findOne({
      where: { id },
      relations: ['user', 'class'],
    });
    if (!bookedClass) {
      throw new NotFoundException(`Reserva con ID ${id} no encontrada.`);
    }
    return bookedClass;
  }

  async createBooked(bookClass: CreateBookedClassDto) {
    const { userId, classId, scheduleId } = bookClass;

    const existingBooking = await this.bookedClassesRepository.findOne({
      where: {
        user: { id: userId },
        class: { id: classId },
        schedule: { id: scheduleId },
      },
    });

    if (existingBooking) {
      throw new BadRequestException(
        'User is already booked for this class and schedule',
      );
    }

    const user = await this.usersRepostory.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const classEntity = await this.classRepository.findOne({
      where: { id: classId },
      relations: ['schedules'],
    });

    if (!classEntity) {
      throw new NotFoundException('Class not found');
    }

    const schedule = classEntity.schedules.find(
      (schedule) => schedule.id === scheduleId,
    );
    if (!schedule) {
      throw new NotFoundException('Schedule not found');
    }

    if (schedule.remainingCapacity <= 0) {
      throw new Error('No remaining capacity in the selected schedule');
    }

    const userExists = await this.usersRepostory.findOne({
      where: { id: userId },
    });
    const scheduleExists = await this.classScheduleRepository.findOne({
      where: { id: scheduleId },
    });

    if (!userExists) {
      throw new NotFoundException('User not found in database');
    }

    if (!scheduleExists) {
      throw new NotFoundException('Schedule not found in database');
    }

    const newBookedClass = this.bookedClassesRepository.create({
      user: userExists,
      schedule: scheduleExists,
      class: classEntity,
    });

    await this.bookedClassesRepository.save(newBookedClass);

    schedule.remainingCapacity -= 1;
    schedule.currentParticipants += 1;

    await this.classScheduleRepository.save(schedule);

    return newBookedClass;
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

    const classDate = new Date(
      `${classSchedule.day}T${classSchedule.startTime}`,
    );

    await this.bookedClassesRepository.remove(booking);

    await this.emailService.sendCancellationEmail(
      booking.user.email,
      booking.class.name,
      classDate,
    );

    return booking;
  }

  async getBooketsByUserId(userId: string) {
    const bookedClasses = await this.bookedClassesRepository.find({
      where: { user: { id: userId } },
      relations: ['user', 'class', 'class.schedules'],
    });

    return bookedClasses.map((bookedClass) => {
      const { user, class: bookedClassDetails } = bookedClass;

      const schedule = bookedClassDetails.schedules?.[0];
      return {
        user,
        class: bookedClassDetails,
        schedule,
      };
    });
  }
  async getBooketsByclassId(classId: string) {
    return await this.bookedClassesRepository.find({
      where: { class: { id: classId } },
      relations: ['user'],
    });
  }
  async deleteByScheduleId(scheduleId: string) {
    await this.bookedClassesRepository.delete({ schedule: { id: scheduleId } });
  }
}
