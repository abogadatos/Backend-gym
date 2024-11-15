import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/create-classes.dto';
import { UpdateClassDto } from './dto/update-classes.dto';

@Controller('classes')
export class ClassesController {
    constructor(private readonly classService:ClassesService){}

    @Get()
    getAllClass(@Query('page') page: string, @Query('limit') limit: string){
        const pageNumber = page ? parseInt(page, 10) : 1; // Valor por defecto: 1
        const limitNumber = limit ? parseInt(limit, 10) : 5; // Valor por defecto: 5

        return this.classService.getAllClasses(pageNumber, limitNumber);
    }
    @Get(':id')
    getClassByID(@Param("id") id :string){
        return this.classService.getClassByID(id);
    }

    @Post()
    postClass(@Body() classe: CreateClassDto) {
      return this.classService.createClass(classe);
    }

    @Put(":id")
    updateClass(@Param("id") id :string, @Body()classe:UpdateClassDto ){
        return this.classService.updateClass(id,classe)

    }
    @Delete(':id')
    deleteClass(@Param("id") id:string){
        return this.classService.deleteClass(id);
    }
    
}
