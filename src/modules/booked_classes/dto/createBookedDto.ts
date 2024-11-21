import { IsString, IsUUID, IsEnum, IsDate, IsOptional } from 'class-validator';
import { Status } from 'src/enum/bookingStatus.enum';

export class CreateBookedClassDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  classId: string;

}
