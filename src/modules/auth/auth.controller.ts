import {
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
  Body,
  BadRequestException,
  UseInterceptors,
  Patch,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/signInUser.dto';
import { CreateUserDto } from './dto/signUpUser.dto';
import { CleanDataPipe } from 'src/pipes/normalize-data.pipe';
import { AuthZeroDTO } from './dto/auth0-logIn.dto';
import { addJWTInterceptor } from 'src/interceptors/addJWT.interceptor';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("auth")
@Controller('auth')
export class AuthController {
  private credentials: LoginUserDto = { email: '', password: '' };
  constructor(private readonly authService: AuthService) {}

  @Post('signup/third')
  @UseInterceptors(addJWTInterceptor)
  async signUpAuthZero(@Body() authZeroData: AuthZeroDTO) {
    return await this.authService.signUpAuth(authZeroData);
    try {
    } catch (error) {
      throw new BadRequestException(
        `No pasa del controller porque: ${error.message}`,
      );
    }
  }

  @Post('signup')
  @UsePipes(new ValidationPipe())
  async signup(@Body(CleanDataPipe) userData: CreateUserDto) {
    await this.authService.signUpForm(userData);
    const { password, email } = userData;
    this.credentials.email = email;
    this.credentials.password = password;

    const logStatus = await this.authService.signIn(this.credentials);
    return logStatus;
  }

  @Post('signin')
  async signIn(@Body() userData: LoginUserDto) {
    return await this.authService.signIn(userData);
  }

  @Patch('signedUpModify')
  async patchUser() {}
}
