import { IsString,Matches,IsOptional,IsNumber } from "class-validator";

export class CreateClassScheduleDto {
  @IsString()
  day: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'startTime must be in HH:mm format',
  })
  startTime: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'endTime must be in HH:mm format',
  })
  endTime: string;

  @IsOptional()
  @IsNumber()
  currentParticipants?: number;
}
