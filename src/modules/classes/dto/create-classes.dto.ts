import { Type } from 'class-transformer';
import { IsString, IsInt, IsUUID, IsOptional, IsPositive, ValidateNested} from 'class-validator';
import { CreateClassScheduleDto } from './createSchedule.dto';

export class CreateClassDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  location: string;

  @IsInt()
  @IsPositive()
  capacity: number;

  @IsString()
  imgUrl: string;

  @IsUUID()
  trainerId: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateClassScheduleDto)
  scheduleClass?: CreateClassScheduleDto[];
}

