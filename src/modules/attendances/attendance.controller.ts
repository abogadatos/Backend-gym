import { Controller, Delete, Get, Post, Put, UseGuards } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enum/roles.enum';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Trainer, Role.Admin, Role.SuperAdmin)
  getAllAttendance() {
    return this.attendanceService.getAllAttendanceService();
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Trainer, Role.Admin, Role.SuperAdmin)
  getAttendanceById() {
    return this.attendanceService.getAttendanceByIdService();
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Trainer, Role.Admin, Role.SuperAdmin)
  registerAttendance() {
    return this.attendanceService.registerAttendanceService();
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Trainer, Role.Admin, Role.SuperAdmin)
  upDateAttendance() {
    return this.attendanceService.upDateAttendanceService();
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  deleteAttendance() {
    return this.attendanceService.deleteAttendanceService();
  }

  @Get('/class/:classId')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Trainer, Role.Admin, Role.SuperAdmin)
  getAttendanceByClassId() {
    return this.attendanceService.getAttendanceByClassIdService();
  }

  @Get('user/:userId')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.User, Role.Associate, Role.Trainer, Role.Admin, Role.SuperAdmin)
  getAttendanceByUserId() {
    return this.attendanceService.getAttendanceByUserIdService();
  }
}
