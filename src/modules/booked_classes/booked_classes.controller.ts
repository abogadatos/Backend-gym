import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { BookedClassesService } from './booked_classes.service';
import { CreateBookedClassDto } from './dto/createBookedDto';

@Controller('booked-classes')
export class BookedClassesController {
  constructor(private readonly bookendClassesService: BookedClassesService) {}

  @Get()
  async getAllBookedClasses() {
    return await this.bookendClassesService.getAllBookedClassesService();
  }
  @Get(':id')
  async getBookedClassById(@Param('id')id:string  ) {
    return await this.bookendClassesService.getBookedClassByIdService(id);
  }

  @Post()
  async createBooked(@Body()bookClassDto:CreateBookedClassDto) {
    return await this.bookendClassesService.createBookedService(bookClassDto);
  }

  @Put(':id')
  async upDateBooked() {
    return await this.bookendClassesService.upDateBookedService();
  }

  @Delete(':id')
  async deleteBooked(@Param('bookingId') bookingId:string) {
    return await this.bookendClassesService.deleteBookedService(bookingId)
  }

  @Get('user/:userId')
  async getBooketsByUserId(@Param('userId')userId:string) {
    return await this.bookendClassesService.getBooketsByUserIdService(userId);
  }

  @Get('class/:classId')
  async getBooketsByclassId(@Param('classId')classId:string) {
    return await this.bookendClassesService.getBooketsByclassIdService(classId);
  }
}
