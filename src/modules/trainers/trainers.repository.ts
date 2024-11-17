import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Trainers } from 'src/database/entities/trainer.entity';
import { User } from 'src/database/entities/user.entity';
import { Role } from 'src/enum/roles.enum';
import { Repository } from 'typeorm';
import * as data from '../../utils/mock-trainers.json';

@Injectable()
export class TrainersCustomRepository {
  constructor(
    @InjectRepository(Trainers)
    private trainersRepository: Repository<Trainers>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async initializerTrainers() {
    const existingTrainers = await this.trainersRepository.count();

    if (existingTrainers === 0) {
      const trainers = await this.trainersRepository.find();

      for (const element of data) {
        const users = await this.usersRepository.findOne({
          where: { roles: Role.Trainer },
        });
        // const trainer = trainers.find((trainer) => (trainer.userID = users.id));
      }
      console.log('✅✅');
    }
  }
}
