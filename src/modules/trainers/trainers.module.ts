import { Module } from '@nestjs/common';
import { TrainersController } from './trainers.controller';
import { TrainersService } from './trainers.service';

@Module({
  imports: [],
  controllers: [TrainersController],
  providers: [TrainersService],
  exports: [],
})
export class TrainersModule {}
