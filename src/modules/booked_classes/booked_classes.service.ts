import { Injectable } from '@nestjs/common';
import { BookedClassesCustomRepository } from './booked_classes.repository';

@Injectable()
export class BookedClassesService {
  constructor(
    private readonly bookedClassesCustomRepository: BookedClassesCustomRepository,
  ) {}

  getAllBookedClassesService() {
    return this.bookedClassesCustomRepository.getAllBookedClasses();
  }

  getBookedClassByIdService() {
    return this.bookedClassesCustomRepository.getBookedClassById();
  }

  createBookedService() {
    return this.bookedClassesCustomRepository.createBooked();
  }
  upDateBookedService() {
    return this.bookedClassesCustomRepository.upDateBooked();
  }
  deleteBookedService() {
    return this.bookedClassesCustomRepository.deleteBooked();
  }
  getBooketsByUserIdService() {
    return this.bookedClassesCustomRepository.getBooketsByUserId();
  }
  getBooketsByclassIdService() {
    return this.bookedClassesCustomRepository.getBooketsByclassId();
  }
}
