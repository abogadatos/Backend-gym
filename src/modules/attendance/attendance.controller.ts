import { Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { AttendanceService } from './attendance.service';

@Controller('attendance')
export class AttendanceController {
    constructor(private readonly AttendanceService:AttendanceService){}

    @Get()
    getAllAttendance(){
        return this.AttendanceService.getAllAttendanceService()
    }

    @Get(':id')
    getAttendanceById(){
        return this.AttendanceService.getAttendanceByIdService()
    }

    @Post()
    registerAttendance(){
        return this.AttendanceService.registerAttendanceService()
    }

    @Put(':id')
    upDateAttendance(){
        return this.AttendanceService.upDateAttendanceService()
    }

    @Delete(':id')
    deleteAttendance(){
        return this.AttendanceService.deleteAttendanceService()
    }

    @Get('/class/:classId')
    getAttendanceByClassId(){
        return this.AttendanceService.getAttendanceByClassIdService()
    }

    @Get('user/:userId')
    getAttendanceByUserId(){
        return this.AttendanceService.getAttendanceByUserIdService()
    }

}
