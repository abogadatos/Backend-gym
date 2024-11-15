import { Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { BookedClassesService } from './booked_classes.service';

@Controller('booked-classes')
export class BookedClassesController {
  constructor(private readonly bookendClassesService: BookedClassesService) {}

  @Get()
  async getAllBookedClasses() {
    return await this.bookendClassesService.getAllBookedClassesService();
  }
  @Get(':id')
  async getBookedClassById() {
    return await this.bookendClassesService.getBookedClassByIdService();
  }

  @Post()
  async createBooked() {
    return await this.bookendClassesService.createBookedService();
  }

  @Put(':id')
  async upDateBooked() {
    return await this.bookendClassesService.upDateBookedService();
  }

  @Delete(':id')
  async deleteBooked() {
    return await this.bookendClassesService.deleteBookedService();
  }

  @Get('user/:userId')
  async getBooketsByUserId() {
    return await this.bookendClassesService.getBooketsByUserIdService();
  }

  @Get('class/:classId')
  async getBooketsByclassId() {
    return await this.bookendClassesService.getBooketsByclassIdService();
  }
}
