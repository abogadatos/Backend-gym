import {
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
  Body,
  BadRequestException,
  UseInterceptors,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/signInUser.dto';
import { CreateUserDto } from './dto/signUpUser.dto';
import { CleanDataPipe } from 'src/pipes/normalize-data.pipe';
import { AuthZeroDTO } from './dto/auth0-logIn.dto';
import { addJWTInterceptor } from 'src/interceptors/addJWT.interceptor';
import { Role } from 'src/enum/roles.enum';
import { Roles } from 'src/decorators/roles.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { BanGuard } from 'src/guards/ban.guard';

@Controller('auth')
export class AuthController {
  private credentials: LoginUserDto = { email: '', password: '' };
  constructor(private readonly authService: AuthService) {}

  @Post('signup/third')
  @ApiBearerAuth()
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
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard, BanGuard)
  @Roles(Role.User, Role.Associate, Role.Admin, Role.SuperAdmin)
  async patchUser() {}
}
