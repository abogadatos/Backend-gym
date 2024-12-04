import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/create-classes.dto';
import { UpdateClassDto } from './dto/update-classes.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enum/roles.enum';
import { BanGuard } from 'src/guards/ban.guard';

@Controller('classes')
export class ClassesController {
  constructor(private readonly classService: ClassesService) {}

  @Get()
  @ApiBearerAuth()
  async getAllClass() {
    return await this.classService.getAllClasses();
  }

  @Get(':id')
  @ApiBearerAuth()
  async getClassByID(@Param('id') id: string) {
    return await this.classService.getClassByID(id);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Trainer, Role.Admin, Role.SuperAdmin)
  async postClass(@Body() createClassDto: CreateClassDto) {
    return await this.classService.createClass(createClassDto);
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Trainer, Role.Admin, Role.SuperAdmin)
  async updateClass(
    @Param('id') id: string,
    @Body() updateClassDto: UpdateClassDto,
  ) {
    return await this.classService.updateClass(id, updateClassDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Trainer, Role.Admin, Role.SuperAdmin)
  async deleteClass(@Param('id') id: string) {
    return await this.classService.deleteClass(id);
  }
}
