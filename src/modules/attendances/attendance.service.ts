import { Injectable } from '@nestjs/common';
import { AttendanceCustomRepository } from './attendance.repository';

@Injectable()
export class AttendanceService {
  constructor(
    private readonly AtterndanceCustomRepository: AttendanceCustomRepository,
  ) {}

  getAllAttendanceService() {
    return this.AtterndanceCustomRepository.getAllAttendance();
  }

  getAttendanceByIdService() {
    return this.AtterndanceCustomRepository.getAttendanceById();
  }

  registerAttendanceService() {
    return this.AtterndanceCustomRepository.registerAttendance();
  }

  upDateAttendanceService() {
    return this.AtterndanceCustomRepository.upDateAttendance();
  }

  deleteAttendanceService() {
    return this.AtterndanceCustomRepository.deleteAttendance();
  }

  getAttendanceByClassIdService() {
    return this.AtterndanceCustomRepository.getAttendanceByClassId();
  }

  getAttendanceByUserIdService() {
    return this.AtterndanceCustomRepository.getAttendanceByUserId();
  }
}
