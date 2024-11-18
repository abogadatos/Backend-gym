// import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsOptional,
  MinLength,
  MaxLength,
  Matches,
  Length,
} from 'class-validator';
import { Match } from 'src/decorators/passwordConfirm.decorator';

/**
 * Data Transfer Object for creating a new User.
 *
 * This DTO ensures that user data meets all necessary validation requirements when creating a new account.
 */
export class CreateUserDto {
  /**
   * User's full name.
   *
   * - Must contain only letters (including accented letters) and spaces.
   * - Must be between 3 and 50 characters long.
   *
   * @example "Nelson Enrique"
   */
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  @Matches(/^[a-zA-ZÀ-ÿ\s]+$/, {
    message: 'name must only contain letters and spaces',
  })
  //   @ApiProperty()
  name: string;

  /**
   * User's email address.
   *
   * - Must be a valid email format.
   *
   * @example "example@example.com"
   */
  @IsEmail({}, { message: 'The email must have a valid format' })
  @IsNotEmpty()
  //   @ApiProperty()
  email: string;

  /**
   * User's password.
   *
   * - Must be at least 8 characters long
   * - Must include at least one letter and one number.
   *
   * @example "password123"
   */
  @IsNotEmpty()
  @IsString()
  @Matches(/^(?=.*\d)(?=.*[a-zA-Z]).{8,}$/, {
    message:
      'The password must be at least 8 characters long and include at least one letter and one number.',
  })
  //   @ApiProperty()
  password: string;

  /**
   * Confirmation of the user's password.
   *
   * - Must match the `password` field.
   *
   * @example "P@ssw0rd!"
   */
  @Match('password', { message: 'Password confirmation must match password' })
  @Matches(/^(?=.\d)(?=.[a-zA-Z]).{8,}$/)
  @Length(8, 15)
  //   @ApiProperty()
  confirmPassword: string;

  /**
   * User's phone number.
   *
   * - Must contain only numeric characters.
   * - Must be between 7 and 15 characters long.
   *
   * @example "123456789"
   */
  @IsNotEmpty()
  @IsString()
  @Matches(/^\d+$/, { message: 'phone must contain only numbers' })
  @Length(7, 15)
  //   @ApiProperty()
  phone: string;

  /**
   * User's country.
   *
   * - Optional field.
   * - Must be between 5 and 20 characters long if provided.
   *
   * @example "Argentina"
   */
  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  //   @ApiProperty()
  country: string;

  /**
   * User's address.
   *
   * - Optional field.
   * - Must be between 3 and 80 characters long if provided.
   *
   * @example "123 Main St, Apt 4B"
   */
  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(80)
  //   @ApiProperty()
  address: string;

  /**
   * User's city.
   *
   * - Optional field.
   * - Must be between 5 and 20 characters long if provided.
   *
   * @example "Buenos Aires"
   */
  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  //   @ApiProperty()
  city: string;
}
