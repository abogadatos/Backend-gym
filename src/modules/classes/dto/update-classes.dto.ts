import { Type } from 'class-transformer';
import { IsString, IsInt, IsUUID, IsOptional, IsPositive, ValidateNested} from 'class-validator';
import { CreateClassScheduleDto } from './createSchedule.dto';

export class UpdateClassDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsInt()
  @IsPositive()
  @IsOptional()
  capacity?: number;

  @IsString()
  @IsOptional()
  imgUrl?: string;

  @IsUUID()
  @IsOptional()
  trainerId?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateClassScheduleDto)
  scheduleClass?: CreateClassScheduleDto[];
}