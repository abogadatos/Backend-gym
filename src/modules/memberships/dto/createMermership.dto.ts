import { IsNotEmpty, IsNumber, IsString, IsOptional, Min, MaxLength, IsPositive, IsIn } from 'class-validator';

export class CreateMembershipDto {
 
 @IsString()
 @IsNotEmpty({ message: 'El nombre es obligatorio.' })
 @MaxLength(50, { message: 'El nombre no puede tener más de 50 caracteres.' })
 name: string;

 
 @IsString()
 @IsNotEmpty()
 @MaxLength(60, { message: 'La descripción no puede tener más de 60 caracteres.' })
 description: string;


 @IsNumber()
 @IsPositive({ message: 'El precio debe ser un número positivo.' })
 price: number;

 @IsNumber()
 @Min(1, { message: 'La duración debe ser al menos 1 día.' })
 @IsPositive({ message: 'La duración debe ser un número positivo.' })
 duration: number;

 @IsString()
  @IsOptional()
  @IsIn(['USD', 'MXN', 'ARS'], {
    message: 'La moneda debe ser una de las siguientes: MXN.',
  })
  currency?: string;
}