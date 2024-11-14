import { Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { AttendanceService } from './attendance.service';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get()
  getAllAttendance() {
    return this.attendanceService.getAllAttendanceService();
  }

  @Get(':id')
  getAttendanceById() {
    return this.attendanceService.getAttendanceByIdService();
  }

  @Post()
  registerAttendance() {
    return this.attendanceService.registerAttendanceService();
  }

  @Put(':id')
  upDateAttendance() {
    return this.attendanceService.upDateAttendanceService();
  }

  @Delete(':id')
  deleteAttendance() {
    return this.attendanceService.deleteAttendanceService();
  }

  @Get('/class/:classId')
  getAttendanceByClassId() {
    return this.attendanceService.getAttendanceByClassIdService();
  }

  @Get('user/:userId')
  getAttendanceByUserId() {
    return this.attendanceService.getAttendanceByUserIdService();
  }
}
