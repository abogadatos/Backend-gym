import { IsNotEmpty, IsNumber, IsString, IsOptional, Min, MaxLength } from 'class-validator';

export class CreateMembershipDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(1)
  duration: number; 

  @IsString()
  @IsOptional()
  currency?: string; 
}