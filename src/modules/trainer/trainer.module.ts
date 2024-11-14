import { Module } from '@nestjs/common';
import { Trainers } from 'src/database/entities/trainer.entity';
import { TrainersController } from './trainer.controller';
import { TrainersService } from './trainer.service';

@Module({
  imports: [TypeOrmModule.forFeature([Trainers])],
  controllers: [TrainersController],
  providers: [TrainersService],
  exports: [TrainersService], // Opcional, si deseas que el servicio sea accesible desde otros módulos
})
export class TrainersModule {}
