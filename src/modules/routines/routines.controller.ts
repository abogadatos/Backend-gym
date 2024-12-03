import {
  Controller,
  Get,
  Post,
  Param,
  UploadedFile,
  UseInterceptors,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { RoutinesService } from './routines.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enum/roles.enum';
import { BanGuard } from 'src/guards/ban.guard';

@Controller('routines')
export class RoutinesController {
  constructor(private readonly routineService: RoutinesService) {}

  @Post('upload')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard, BanGuard)
  @Roles(Role.Trainer, Role.Admin, Role.SuperAdmin)
  @UseInterceptors(FileInterceptor('file'))
  async uploadRoutineFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 500 * 1024 * 1024,
            message: 'El archivo es demasiado grande.',
          }),
          new FileTypeValidator({
            fileType: /jpg|jpeg|gif|png|webp|svg|mp4|pdf|mov/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.routineService.uploadRoutine(file);
  }

  @Get() // TODO después de verificación de Rodrigo, borrar Role.User
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard, BanGuard)
  @Roles(Role.User, Role.Associate, Role.Trainer, Role.Admin, Role.SuperAdmin)
  async getAllRoutines() {
    return this.routineService.getAllRoutines();
  }

  @Get(':id') // TODO después de verificación de Rodrigo, borrar Role.User
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard, BanGuard)
  @Roles(Role.User, Role.Associate, Role.Trainer, Role.Admin, Role.SuperAdmin)
  async getRoutineById(@Param('id') id: string) {
    return this.routineService.getRoutineById(id);
  }
}
