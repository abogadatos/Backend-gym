import { Injectable } from '@nestjs/common';

import { CreateTrainerDto } from './dto/create-trainer.dto';
import { UpdateTrainerDto } from './dto/update-trainer.dto';

@Injectable()
export class TrainersService {
  async create(createTrainerDto: CreateTrainerDto) {
    createTrainerDto;
    return 'This action adds a new trainer';
  }

  async findAll() {
    return `This action returns all trainers`;
  }

  async findOne(id: number) {
    return `This action returns a #${id} trainer`;
  }

  async update(id: number, updateTrainerDto: UpdateTrainerDto) {
    updateTrainerDto;
    return `This action updates a #${id} trainer`;
  }

  async remove(id: number) {
    return `This action removes a #${id} trainer`;
  }
}
