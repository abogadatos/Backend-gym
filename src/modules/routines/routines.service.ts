import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CloudinaryService } from './cloudinary.service';
import { Routine } from 'src/database/entities/routines.entity';

@Injectable()
export class RoutinesService{
  constructor(
    @InjectRepository(Routine)
    private readonly routineRepository: Repository<Routine>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async uploadRoutine(file: Express.Multer.File) {
    const routineUrl = await this.cloudinaryService.uploadFile(file);
    const newRoutine = this.routineRepository.create({ routine: routineUrl });
    return this.routineRepository.save(newRoutine);
  }

  async getAllRoutines() {
    return this.routineRepository.find();
  }

  async getRoutineById(id: string) {
    const routine = await this.routineRepository.findOne({ where: { id } });
    if (!routine) throw new NotFoundException('Routine not found');
    return routine;
  }
}
