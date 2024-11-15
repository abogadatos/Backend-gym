import { IsEmail, IsEnum, IsPhoneNumber, IsString, MaxLength } from 'class-validator';
import { MembershipStatus } from 'src/enum/membership_status.enum';
import { Role } from 'src/enum/roles.enum';


export class CreateUserDto {

  @IsString()
  @MaxLength(50)
  firstName: string;

  @IsString()
  @MaxLength(50)
  lastName: string;

  @IsEmail()
  @MaxLength(80)
  email: string;

  @IsString()
  @MaxLength(60)
  password: string;

  @IsEnum(Role)
  roles: Role[];

  @IsEnum(MembershipStatus)
  membership_status: MembershipStatus;

  @IsPhoneNumber()
  phone: string;

  @IsString()
  address: string;

  @IsString()
  profilePicture: string;
}
