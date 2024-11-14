import { Injectable } from '@nestjs/common';
import { AttendanceRepository } from './attendance.repository';

@Injectable()
export class AttendanceService {
  constructor(private readonly AtterndanceRepository: AttendanceRepository) {}

  getAllAttendanceService() {
    return this.AtterndanceRepository.getAllAttendance();
  }
  getAttendanceByIdService() {
    return this.AtterndanceRepository.getAttendanceById();
  }
  registerAttendanceService() {
    return this.AtterndanceRepository.registerAttendance();
  }
  upDateAttendanceService() {
    return this.AtterndanceRepository.upDateAttendance();
  }
  deleteAttendanceService() {
    return this.AtterndanceRepository.deleteAttendance();
  }
  getAttendanceByClassIdService() {
    return this.AtterndanceRepository.getAttendanceByClassId();
  }
  getAttendanceByUserIdService() {
    return this.AtterndanceRepository.getAttendanceByUserId();
  }
}
