import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Classes } from 'src/database/entities/classes.entity';
import { Trainers } from 'src/database/entities/trainer.entity';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class SeederClass implements OnModuleInit {
  constructor(
    @InjectRepository(Classes)
    private readonly classesRepository: Repository<Classes>,

    @InjectRepository(Trainers)
    private readonly trainerRepository: Repository<Trainers>
  ) {}

  async onModuleInit() {
    await setTimeout(() => this.addClasses(), 3000);
  }

  async addClasses() {
    const mockDataPath = path.join(__dirname, 'mockClass.json');
    const rawData = fs.readFileSync(mockDataPath, 'utf8');
    const data = JSON.parse(rawData);

    
    const trainers = await this.trainerRepository.find({ relations: ['user'] });

    for (const element of data) {
      
      const trainer = trainers.find(
        (t) => `${t.user.firstName} ${t.user.lastName}` === element.trainerName
      );

      
      if (!trainer) {
        console.warn(`Trainer no encontrado para ${element.trainerName}`);
        continue;
      }

     
      const newClass = new Classes();
      newClass.name = element.name;
      newClass.description = element.description;
      newClass.location = element.location;
      newClass.capacity = element.capacity;
      newClass.current_participants = element.current_participants;
      newClass.schedule = new Date(element.schedule);
      newClass.imgUrl = element.imgUrl || null;
      newClass.created_at = new Date();
      newClass.update_at = new Date();
      newClass.trainer = trainer; 
      

      await this.classesRepository.save(newClass);
      console.log(`Clase "${element.name}" agregada correctamente.`);
    }
  }
}
