import {IsOptional,IsString,Matches,IsNumber} from 'class-validator'
export class UpdateClassScheduleDto {
    @IsOptional()
    @IsString()
    day?: string;
  
    @IsOptional()
    @IsString()
    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
      message: 'startTime must be in HH:mm format',
    })
    startTime?: string;
  
    @IsOptional()
    @IsString()
    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
      message: 'endTime must be in HH:mm format',
    })
    endTime?: string;
  
    @IsOptional()
    @IsNumber()
    currentParticipants?: number;
  }
  