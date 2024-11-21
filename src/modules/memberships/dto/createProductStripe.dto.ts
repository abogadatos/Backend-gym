import { IsString, IsNumber, IsUUID, IsDateString } from 'class-validator';

export class CreateProductDtoStripe {
  @IsUUID()
  id: string;

  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsNumber()
  duration: number;

  @IsString()
  description: string;

  @IsDateString()
  created_at: string;

  @IsString()
  currency: string;
}
