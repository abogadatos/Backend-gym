import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendance } from 'src/database/entities/attendance.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AttendanceCustomRepository {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
  ) {}

  getAllAttendance() {
    return 'obtener todos los registros de asistencia';
  }

  getAttendanceById() {
    return 'obtiene el registro de asistencia por id ';
  }

  registerAttendance() {
    return 'registra la asistencia de un usuario';
  }

  upDateAttendance() {
    return 'modifica el registro de asistencia';
  }

  deleteAttendance() {
    return 'elimina el registro de asistencia por id';
  }

  getAttendanceByClassId() {
    return 'obtener la asistencia de una clase especifica';
  }

  getAttendanceByUserId() {
    return 'obtener la asistencia de un usuario especifico';
  }
}
