import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BookedClassesService } from './booked_classes.service';
import { CreateBookedClassDto } from './dto/createBookedDto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enum/roles.enum';
import { BanGuard } from 'src/guards/ban.guard';

@Controller('booked-classes')
export class BookedClassesController {
  constructor(private readonly bookendClassesService: BookedClassesService) {}

  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Trainer, Role.Admin, Role.SuperAdmin)
  async getAllBookedClasses() {
    return await this.bookendClassesService.getAllBookedClassesService();
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles( Role.Trainer, Role.Admin, Role.SuperAdmin)
  async getBookedClassById(@Param('id') id: string) {
    return await this.bookendClassesService.getBookedClassByIdService(id);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Associate, Role.Admin, Role.SuperAdmin)
  async createBooked(@Body() bookClassDto: CreateBookedClassDto) {
    return await this.bookendClassesService.createBookedService(bookClassDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Associate, Role.Admin, Role.SuperAdmin)
  async deleteBooked(@Param('bookingId') bookingId: string) {
    return await this.bookendClassesService.deleteBookedService(bookingId);
  }

  @Get('user/:userId') // TODO revisar funcionamiento
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Trainer, Role.Admin, Role.SuperAdmin)
  async getBooketsByUserId(@Param('userId') userId: string) {
    return await this.bookendClassesService.getBooketsByUserIdService(userId);
  }

  @Get('class/:classId') // TODO después de verificación de Rodrigo, borrar Role.User
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles( Role.Associate, Role.Trainer, Role.Admin, Role.SuperAdmin)
  async getBooketsByclassId(@Param('classId') classId: string) {
    return await this.bookendClassesService.getBooketsByclassIdService(classId);
  }
}
