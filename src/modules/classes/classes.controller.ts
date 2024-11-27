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

@Controller('classes')
export class ClassesController {
  constructor(private readonly classService: ClassesService) {}

  @Get()
  async getAllClass(
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    const pageNumber = page ? parseInt(page, 10) : 1; 
    const limitNumber = limit ? parseInt(limit, 10) : 6; 

    return await this.classService.getAllClasses(pageNumber, limitNumber);
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
