import { Injectable } from '@nestjs/common';

import { CreateTrainerDto } from './dto/create-trainer.dto';
import { UpdateTrainerDto } from './dto/update-trainer.dto';
import { TrainersCustomRepository } from './trainers.repository';

@Injectable()
export class TrainersService {

constructor(
  private readonly trainerRepository:TrainersCustomRepository
){}
  async create(createTrainerDto: CreateTrainerDto) {
    return await this.trainerRepository.createTrainer(createTrainerDto)
    
  }

  async findAll(page: number, limit: number) {
    return await this.trainerRepository.getAllTrainers(page,limit)
  }

  async findOne(id: string ) {
    return await this.trainerRepository.getTrainerById(id)
  }

  async update(id: string, updateTrainerDto: UpdateTrainerDto) {
    return await this.trainerRepository.updateTrainers(id,updateTrainerDto)
  }

  async remove(id: string) {
    return await this.trainerRepository.deleteTrainer(id)
  }
}
