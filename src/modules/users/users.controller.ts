import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  Query,
  HttpException,
  HttpStatus,
  ParseUUIDPipe,
  Patch,
  UseGuards,
  NotFoundException,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/updateUser.dto';
import { User } from 'src/database/entities/user.entity';
import { Role } from 'src/enum/roles.enum';
import { Roles } from 'src/decorators/roles.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { BanGuard } from 'src/guards/ban.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('seeder')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  async seeder() {
    return await this.usersService.userSeeder();
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  async userGetter(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('sortBy') sortBy: string = 'roles',
    @Query('order') order: 'ASC' | 'DESC' = 'ASC',
  ) {
    try {
      const pageQuery = Number(page);
      const limitQuery = Number(limit);
      if (pageQuery && limitQuery) {
        return await this.usersService.getUsers(
          pageQuery,
          limitQuery,
          sortBy,
          order,
        );
      } else return await this.usersService.getUsers(1, 5, sortBy, order);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error:
            'It wasnt possible to fetch users. Check if they do exist within database',
        },
        404,
      );
    }
  }

  @Patch('ban/:id')
  @ApiBearerAuth()
  @Roles(Role.Admin, Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  async banUser(
    @Param('id', ParseUUIDPipe) userId: string,
    @Body('reason') reason: string,
  ) {
    const userData = await this.usersService.getUserById(userId);
    if (!userData) throw new NotFoundException('User not found');

    userData.banned = true;
    userData.banReason = reason;
    userData.bannedAt = new Date();

    // TODO arreglar, aquí está el error de por qué no deja avanzar en el proceso de banear user google. googleIncomplete
    await this.usersService.updateUser(userId, userData);

    console.info({
      message: `User ${userData.name} has been banned`,
      userData,
    });

    return { message: `User ${userData.name} has been banned`, userData };
  }

  @Patch('unban/:id')
  @ApiBearerAuth()
  @Roles(Role.Admin, Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  async unbanUser(@Param('id', ParseUUIDPipe) userId: string) {
    const user = await this.usersService.getUserById(userId);
    if (!user) throw new NotFoundException('User not found');

    user.banned = false;
    user.banReason = null;
    user.bannedAt = null;

    await this.usersService.updateUser(userId, user);

    return { message: `User ${user.name} has been unbanned`, user };
  }

  @Put(':id')
  @ApiBearerAuth()
  @Roles(Role.User, Role.Associate, Role.Admin, Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard, BanGuard)
  async updateUser(
    @Param('id', ParseUUIDPipe) userID: string,
    @Body() userData: UpdateUserDto,
  ) {
    return await this.usersService.updateUser(userID, userData);
  }

  @Get('/profile/:id')
  @ApiBearerAuth()
  @Roles(Role.User, Role.Associate, Role.Admin, Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard, BanGuard)
  async getUserById(@Param('id') id: string) {
    return await this.usersService.getUserById(id);
  }

  @Get('email/:email')
  @ApiBearerAuth()
  @Roles(Role.Admin, Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard, BanGuard)
  async getUserByEmail(@Param('email') email: string): Promise<User> {
    return await this.usersService.getUserByEmail(email);
  }

  @Delete('delete/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  async deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.deleteUser(id);
  }
}
