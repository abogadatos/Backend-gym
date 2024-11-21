import { Injectable,NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookedClasses } from 'src/database/entities/booked_classes.entity';
import { Classes } from 'src/database/entities/classes.entity';
import { User } from 'src/database/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateBookedClassDto } from './dto/createBookedDto';
import { EmailService } from '../email/email.service';
import { Status } from 'src/enum/bookingStatus.enum';

@Injectable()
export class BookedClassesCustomRepository {
  constructor(
    private readonly EmailService:EmailService,
    @InjectRepository(BookedClasses)
    private readonly bookedClassesRepository: Repository<BookedClasses>,

    @InjectRepository(User)
    private readonly usersRepostory:Repository<User>,

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
  

  async createBooked(bookClass:CreateBookedClassDto) {
    const { userId, classId} = bookClass

    const user= await this.usersRepostory.findOne({
      where:{id:userId}
    })
    if (!user) throw new NotFoundException('Usuario no encontrado.');
    const selectedClass= await this.classRepository.findOne({
      where:{id:classId}
    })
    if (!selectedClass) throw new NotFoundException('Clase no encontrada.');

    const existingBooking = await this.bookedClassesRepository.findOne({
      where: { user: { id: userId }, class: { id: classId } },
    });
  
    if (existingBooking) throw new BadRequestException('El usuario ya tiene una reserva para esta clase');



    if (selectedClass.current_participants >= selectedClass.capacity) {
      throw new BadRequestException('La clase ya está completa.');
    }

    const booking = await this.bookedClassesRepository.create({
      user,
      class: selectedClass,
      booking_date: selectedClass.schedule
    });
  
    await this.bookedClassesRepository.save(booking);

      await this.EmailService.sendReservatioemail(
        user.email,
        selectedClass.name,
        selectedClass.schedule,
      )
    
    
    selectedClass.current_participants++;
    await this.classRepository.save(selectedClass)

    return booking
  }

  upDateBooked() {
    return 'editar una reserva';
  }

  async deleteBooked(bookingId:string) {
     const booking = await this.bookedClassesRepository.findOne({ 
          where: { id: bookingId },
           relations: ['user', 'class'] 
          })
      if(!booking) throw new BadRequestException('no se encontro la reserva')
    
    booking.status = Status.Canceled;
    await this.bookedClassesRepository.save(booking)

    await this.EmailService.sendCancellationEmail(
      booking.user.email,
      booking.class.name,
      booking.class.schedule,
    )

    return booking

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



