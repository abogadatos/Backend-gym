import { Type } from 'class-transformer';
import { IsString, IsInt,IsArray, IsUUID, IsOptional, IsPositive, ValidateNested} from 'class-validator';
import { UpdateClassScheduleDto } from 'src/modules/schedule/dto/updateSchedule.dto';

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
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UpdateClassScheduleDto)
    schedules?: UpdateClassScheduleDto
}