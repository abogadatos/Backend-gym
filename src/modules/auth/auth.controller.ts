import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { addJWTInterceptor } from 'src/interceptors/addJWT.interceptor';
import { CleanDataPipe } from 'src/pipes/normalize-data.pipe';
import { AuthService } from './auth.service';
import { AuthZeroDTO } from './dto/auth0-logIn.dto';
import { LoginUserDto } from './dto/signInUser.dto';
import { CreateUserDto } from './dto/signUpUser.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { BanGuard } from 'src/guards/ban.guard';

@Controller('auth')
export class AuthController {
  private credentials: LoginUserDto = { email: '', password: '' };
  constructor(private readonly authService: AuthService) {}

  @Post('signup/third')
  @ApiBearerAuth()
  @UseGuards(BanGuard)
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
  @UseGuards(BanGuard)
  async signIn(@Body() userData: LoginUserDto) {
    return await this.authService.signIn(userData);
  }
}
