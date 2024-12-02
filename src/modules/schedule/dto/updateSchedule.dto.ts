import { IsOptional, IsUUID, IsString, IsNumber, Min } from 'class-validator';

export class UpdateClassScheduleDto {
  @IsOptional()
  @IsUUID()
  id?: string; 
 
  @IsOptional()
  @IsString()
  day?: string;

  @IsOptional()
  @IsString()
  startTime?: string;
  
  @IsOptional()
  @IsString()
  endTime?: string;
 
  @IsOptional()
  @IsNumber()
  currentParticipants?: number;
}
