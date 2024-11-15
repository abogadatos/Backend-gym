import { IsString, IsInt, IsDate, IsUUID, IsOptional } from 'class-validator';

export class CreateClassDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  location: string;

  @IsInt()
  capacity: number;

  @IsInt()
  current_participants: number;

  @IsDate()
  schedule: Date;

  @IsString()
  @IsOptional()
  imgUrl?: string;

  @IsUUID()
  trainerId: string;
}
