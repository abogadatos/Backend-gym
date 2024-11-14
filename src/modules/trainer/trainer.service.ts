import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Classes } from 'src/database/entities/classes.entity';
import { Trainers } from 'src/database/entities/trainer.entity';
import { Repository } from 'typeorm';

import { CreateTrainerDto } from './dto/create-trainer.dto';
import { UpdateTrainerDto } from './dto/update-trainer.dto';

@Injectable()
export class TrainersService {
  constructor(
    @InjectRepository(Trainers)
    private trainersRepository: Repository<Trainers>,
  ) {}

  async create(createTrainerDto: CreateTrainerDto): Promise<Trainers> {
    const trainer = this.trainersRepository.create(createTrainerDto);
    return await this.trainersRepository.save(trainer);
  }

  async findAll(): Promise<Trainers[]> {
    return await this.trainersRepository.find({ relations: ['user'] });
  }

  async findOne(id: string): Promise<Trainers> {
    const trainer = await this.trainersRepository.findOne({
      where: { id },
      relations: ['user', 'classes'],
    });
    if (!trainer) {
      throw new NotFoundException(`Trainer with ID ${id} not found`);
    }
    return trainer;
  }

  async update(id: string, UpdateTrainerDto: UpdateTrainerDto): Promise<Trainers> {
    await this.trainersRepository.update(id, UpdateTrainerDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.trainersRepository.delete(id);
  }

  async findTrainerClasses(id: string): Promise<Classes[]> {
    const trainer = await this.trainersRepository.findOne({
      where: { id },
      relations: ['classes'],
    });
    if (!trainer) {
      throw new NotFoundException(`Trainer with ID ${id} not found`);
    }
    return trainer.classes;
  }
}
