import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateCustomerDto {
  @IsEmail()
  @IsNotEmpty({ message: 'El email es obligatorio' })
  userEmail: string;

  @IsString()
  @IsNotEmpty({ message: 'El nombre de usuario es obligatorio' })
  userName: string;

  @IsString()
  @IsNotEmpty({ message: 'El ID del precio en Stripe es obligatorio' })
  stripePriceId: string;
}
