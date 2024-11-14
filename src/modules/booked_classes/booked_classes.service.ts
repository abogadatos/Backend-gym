import { Injectable } from '@nestjs/common';
import { BookedClassesRepository } from './booked_classes.repository';


@Injectable()
export class BookedClassesService {
    constructor(
        private readonly bookedClassesRepository:BookedClassesRepository
    ){}

    getAllBookedClassesService(){
        return this.bookedClassesRepository.getAllBookedClasses()
    }

    getBookedClassByIdService(){
        return this.bookedClassesRepository.getBookedClassById()
    }

    createBookedService(){
        return this.bookedClassesRepository.createBooked()
    }
    upDateBookedService(){
        return this.bookedClassesRepository.upDateBooked()
    }
    deleteBookedService(){
        return this.bookedClassesRepository.deleteBooked()
    }
    getBooketsByUserIdService(){
        return this.bookedClassesRepository.getBooketsByUserId()
    }
    getBooketsByclassIdService(){
        return this.bookedClassesRepository.getBooketsByclassId()
    }
}


