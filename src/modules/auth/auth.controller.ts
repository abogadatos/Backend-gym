import {
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/loginUser.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { CleanDataPipe } from 'src/pipes/cleanName.pipe';

@Controller('auth')
export class AuthController {
  private credentials: LoginUserDto = { email: '', password: '' };
  constructor(private readonly authService: AuthService) {}

  // @Anahidia working here
  @Post('signin')
  async signIn(@Body() userData: LoginUserDto) {
    userData;
  }

  // @nechodev working here
  @Post('signup')
  @UsePipes(new ValidationPipe())
  async signup(@Body(CleanDataPipe) userData: CreateUserDto) {
    const userWithoutPassword = await this.authService.signUp(userData);
    const { password, email } = userData;
    this.credentials.email = email;
    this.credentials.password = password;

    const logStatus = await this.authService.signIn(this.credentials);
    return { 'User Data': userWithoutPassword, 'Log Status': logStatus };
  }
}
