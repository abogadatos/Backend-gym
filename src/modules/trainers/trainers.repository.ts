import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Trainers } from 'src/database/entities/trainer.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TrainersCustomRepository {
  constructor(
    @InjectRepository(Trainers)
    private trainersRepository: Repository<Trainers>,
  ) {}

  async initializerTrainers() {
    const existingTrainers = await this.trainersRepository.count();

    if (existingTrainers === 0) {
    }
  }
}
