import { Controller, Delete, Get, Post,Put} from '@nestjs/common';
import { BookedClassesService } from './booked_classes.service';

@Controller('booked-classes')
export class BookedClassesController {
constructor(private readonly bookendClassesService:BookedClassesService ){}

@Get()
getAllBookedClasses(){
    return this.bookendClassesService.getAllBookedClassesService()
}
@Get(':id')
getBookedClassById(){
    return this.bookendClassesService.getBookedClassByIdService()
}

@Post()
createBooked(){
    return this.bookendClassesService.createBookedService()
}

@Put(':id')
upDateBooked(){
    return this.bookendClassesService.upDateBookedService()
}

@Delete(':id')
deleteBooked(){
    return this.bookendClassesService.deleteBookedService()
}

@Get('user/:userId')
getBooketsByUserId(){
    return this.bookendClassesService.getBooketsByUserIdService()
}

@Get('class/:classId')
getBooketsByclassId(){
    return this.bookendClassesService.getBooketsByclassIdService()
}



}
