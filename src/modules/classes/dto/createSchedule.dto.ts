import { IsString, Matches, IsOptional, IsNumber, IsUUID } from 'class-validator';

export class CreateClassScheduleDto {
  @IsString()
  day: string;  // Día de la clase, por ejemplo, "lunes", "martes", etc.

  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'startTime must be in HH:mm format',
  })
  startTime: string;  // Hora de inicio en formato HH:mm

  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'endTime must be in HH:mm format',
  })
  endTime: string;  // Hora de fin en formato HH:mm

  @IsOptional()
  @IsNumber()
  currentParticipants?: number;  // Opcional: número actual de participantes
  
  @IsOptional()
  @IsNumber()
  remainingCapacity:number

  @IsOptional()
  @IsUUID()
  classId?: string;  // ID de la clase, solo si es necesario asociarlo desde el DTO
}
