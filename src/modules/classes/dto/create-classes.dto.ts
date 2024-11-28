import { Type } from 'class-transformer';
import {
  IsString,
  IsInt,
  IsUUID,
  IsPositive,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { CreateClassScheduleDto } from './createSchedule.dto';

export class CreateClassDto {
  @IsString()
  name: string; // Nombre de la clase

  @IsString()
  description: string; // Descripción de la clase

  @IsString()
  location: string; // Ubicación donde se llevará a cabo la clase

  @IsInt()
  @IsPositive()
  capacity: number; // Capacidad máxima de la clase

  @IsString()
  imgUrl: string; // URL de la imagen para la clase

  @IsUUID()
  trainerId: string; // ID del entrenador asociado

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateClassScheduleDto)
  schedules: CreateClassScheduleDto[]; // Lista de horarios asociados a la clase
}
