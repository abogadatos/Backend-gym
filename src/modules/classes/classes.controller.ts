import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/create-classes.dto';
import { UpdateClassDto } from './dto/update-classes.dto';

@Controller('classes')
export class ClassesController {
    constructor(private readonly classService:ClassesService){}

    @Get()
    async getAllClass(@Query('page') page: string, @Query('limit') limit: string){
        const pageNumber = page ? parseInt(page, 10) : 1; // Valor por defecto: 1
        const limitNumber = limit ? parseInt(limit, 10) : 5; // Valor por defecto: 5

        return await this.classService.getAllClasses(pageNumber, limitNumber);
    }
    @Get(':id')
    async getClassByID(@Param("id") id :string){
        return await this.classService.getClassByID(id);
    }

    @Post()
    async postClass(@Body() classe: CreateClassDto) {
      return await this.classService.createClass(classe);
    }

    @Put(":id")
    async updateClass(@Param("id") id :string, @Body()classe:UpdateClassDto ){
        return await this.classService.updateClass(id,classe)

    }
    @Delete(':id')
    async deleteClass(@Param("id") id:string){
        return await this.classService.deleteClass(id);
    }
    
}
