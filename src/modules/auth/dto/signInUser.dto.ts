// import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginUserDto {
  /**
   * -Must contains one of these special characters !@#$%^&_*
   *
   * -Must be a string with a minimum of 8 characters and a maximum of 15
   *
   *@example "superpassword123$"
   */
  @IsString()
  //   @ApiProperty()
  password: string;

  /**
   * -Must be a valid email address
   *
   * -Must be the email with which you registered
   *
   * @example superemail@example.com
   */
  @IsString()
  //   @ApiProperty()
  email: string;
}
