import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';

import { CreateTrainerDto } from './dto/create-trainer.dto';
import { TrainersService } from './trainer.service';

@Controller('trainers')
export class TrainersController {
  constructor(private readonly trainersService: TrainersService) {}

  @Post()
  create(@Body() createTrainerDto: CreateTrainerDto) {
    return this.trainersService.create(createTrainerDto);
  }

  

  @Get()
  findAll() {
    return this.trainersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.trainersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTrainerDto) {
    return this.trainersService.update(id, updateTrainerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.trainersService.remove(id);
  }

  @Get(':id/classes')
  findTrainerClasses(@Param('id') id: string) {
    return this.trainersService.findTrainerClasses(id);
  }
}

