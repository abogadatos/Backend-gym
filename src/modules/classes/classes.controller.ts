import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/create-classes.dto';
import { UpdateClassDto } from './dto/update-classes.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("classes")
@Controller('classes')
export class ClassesController {
  constructor(private readonly classService: ClassesService) {}

  @Get()
  async getAllClass() {
 
    return await this.classService.getAllClasses();
  }
  @Get(':id')
  async getClassByID(@Param('id') id: string) {
    return await this.classService.getClassByID(id);
  }

  @Post()
  async postClass(@Body() createClassDto:CreateClassDto ) {
    return await this.classService.createClass(createClassDto);
  }

  @Put(':id')
  async updateClass(@Param('id') id: string, @Body() updateClassDto: UpdateClassDto) {
    return await this.classService.updateClass(id,updateClassDto );
  }
  @Delete(':id')
  async deleteClass(@Param('id') id: string) {
    return await this.classService.deleteClass(id);
  }
}
