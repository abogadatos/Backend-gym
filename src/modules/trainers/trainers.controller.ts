import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Post,
  Query
} from '@nestjs/common';

import { CreateTrainerDto } from './dto/create-trainer.dto';
import { UpdateTrainerDto } from './dto/update-trainer.dto';
import { TrainersService } from './trainers.service';

@Controller('trainers')
export class TrainersController {
  constructor(private readonly trainersService: TrainersService) {}

  @Post()
  async create(@Body() createTrainerDto: CreateTrainerDto) {
    return await this.trainersService.create(createTrainerDto);
  }

  @Get()
  async findAll(@Query('page') page: string,
  @Query('limit') limit: string,
) {
  const pageNumber = page ? parseInt(page, 10) : 1; 
  const limitNumber = limit ? parseInt(limit, 10) : 6; 
return await this.trainersService.findAll(pageNumber,limitNumber)
}
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.trainersService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTrainerDto: UpdateTrainerDto,
  ) {
    return await this.trainersService.update(id, updateTrainerDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.trainersService.remove(id);
  }
}
