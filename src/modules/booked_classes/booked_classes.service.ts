import { Injectable } from '@nestjs/common';
import { BookedClassesCustomRepository } from './booked_classes.repository';
import { CreateBookedClassDto } from './dto/createBookedDto';

@Injectable()
export class BookedClassesService {
  constructor(
    private readonly bookedClassesCustomRepository: BookedClassesCustomRepository,
  ) {}

  getAllBookedClassesService() {
    return this.bookedClassesCustomRepository.getAllBookedClasses();
  }

  getBookedClassByIdService(id: string) {
    return this.bookedClassesCustomRepository.getBookedClassById(id);
  }

  createBookedService(bookClassDto: CreateBookedClassDto) {
    return this.bookedClassesCustomRepository.createBooked(bookClassDto);
  }

  deleteBookedService(bookingId: string) {
    return this.bookedClassesCustomRepository.deleteBooked(bookingId);
  }
  getBooketsByUserIdService(userId: string) {
    return this.bookedClassesCustomRepository.getBooketsByUserId(userId);
  }
  getBooketsByclassIdService(classId: string) {
    return this.bookedClassesCustomRepository.getBooketsByclassId(classId);
  }
}
