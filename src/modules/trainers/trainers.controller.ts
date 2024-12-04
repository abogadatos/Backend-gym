import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { CreateTrainerDto } from './dto/create-trainer.dto';
import { UpdateTrainerDto } from './dto/update-trainer.dto';
import { TrainersService } from './trainers.service';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enum/roles.enum';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { BanGuard } from 'src/guards/ban.guard';

@Controller('trainers')
export class TrainersController {
  constructor(private readonly trainersService: TrainersService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  async create(@Body() createTrainerDto: CreateTrainerDto) {
    return await this.trainersService.create(createTrainerDto);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  // corroborar su usuario puede ver trainers x ID
  @Roles(Role.User, Role.Admin, Role.SuperAdmin)
  async findAll(@Query('page') page: string, @Query('limit') limit: string) {
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? parseInt(limit, 10) : 6;
    return await this.trainersService.findAll(pageNumber, limitNumber);
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  // corroborar su usuario puede ver trainers x ID
  @Roles(Role.User, Role.Admin, Role.SuperAdmin)
  async findOne(@Param('id') id: string) {
    return await this.trainersService.findOne(id);
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  async update(
    @Param('id') id: string,
    @Body() updateTrainerDto: UpdateTrainerDto,
  ) {
    return await this.trainersService.update(id, updateTrainerDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  async remove(@Param('id') id: string) {
    return await this.trainersService.remove(id);
  }
}
