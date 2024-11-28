import { IsEmail, IsOptional, IsString } from 'class-validator';

export class AuthZeroDTO {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  image: string;
}
