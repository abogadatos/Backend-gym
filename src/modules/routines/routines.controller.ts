import { Controller, Get, Post, Param, UploadedFile, UseInterceptors, FileTypeValidator, MaxFileSizeValidator, ParseFilePipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { RoutinesService } from './routines.service';


@Controller('routines')
export class RoutinesController {
  constructor(private readonly routineService: RoutinesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadRoutineFile(
    @UploadedFile(new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({
          maxSize: 500 * 1024 * 1024, 
          message: 'El archivo es demasiado grande.',
        }),
        new FileTypeValidator({
          fileType: /jpg|jpeg|gif|png|webp|svg|mp4|pdf|mov/, 
        }),
      ],
    })) file: Express.Multer.File,
  ) {
    return this.routineService.uploadRoutine(file);
  }


  @Get()
  async getAllRoutines() {
    return this.routineService.getAllRoutines();
  }

  @Get(':id')
  async getRoutineById(@Param('id') id: string) {
    return this.routineService.getRoutineById(id);
  }
}
