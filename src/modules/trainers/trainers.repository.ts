import { Injectable,NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trainers } from 'src/database/entities/trainer.entity';
import { User } from 'src/database/entities/user.entity';
import { Role } from 'src/enum/roles.enum';

@Injectable()
export class TrainersCustomRepository {
  constructor(
    @InjectRepository(Trainers)
    private readonly trainersRepository: Repository<Trainers>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Seeder to populate the trainers table based on users with the role 'Trainer'
  async initializeTrainers() {
    const existingTrainers = await this.trainersRepository.count();

    // Only seed trainers if there are no existing entries
    if (existingTrainers === 0) {
      // Fetch users with the role of 'Trainer'
      const trainerUsers = await this.userRepository.find({
        where: { roles: Role.Trainer },
      });

      // Check if there are users with the 'Trainer' role
      if (trainerUsers.length === 0) {
        console.warn('No users found with the role of Trainer');
        return;
      }

      // Create trainers based on users with the role 'Trainer'
      for (const trainerUser of trainerUsers) {
        await this.trainersRepository
          .createQueryBuilder()
          .insert()
          .into(Trainers)
          .values({
            name: trainerUser.name,
            userID: trainerUser,
            bio: `Hello, I'm ${trainerUser.name}. Welcome to my training sessions!`,
            specialties: 'General Fitness, Strength Training',
            experience_years: Math.floor(Math.random() * 10) + 1, // Random experience between 1 to 10 years
          })
          .orIgnore()
          .execute();

        console.info(`Trainer for user ${trainerUser.name} added successfully`);
      }

      console.log(`
        Trainers' database populated successfully from trainers' custom repo
        _________________________________________________________________
      `);

      return {
        message: `Trainers were added from trainers' custom repo`,
      };
    } else {
      console.warn('Trainers already exist within the database');
      return `Trainers already exist within the database`;
    }
  }

  async getTrainerById(id: string) {
    const trainer = await this.trainersRepository.findOne({ where: { id } });
    if (!trainer) throw new NotFoundException('No se Enontro el trainer');
    return trainer
  }

}
