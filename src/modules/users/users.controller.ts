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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/updateUser.dto';
import { User } from 'src/database/entities/user.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("users")
@Controller('users')
// Este interceptor elimina la password para que no se muestre cuando se consulte info de users, si no funciona, avisar a @nechodev
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('seeder')
  async seeder() {
    return await this.usersService.userSeeder();
  }

  @Get()
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

  @Patch(':id')
  async updateUser(
    @Param('id', ParseUUIDPipe) userID: string,
    @Body() userData: UpdateUserDto,
  ) {
    return await this.usersService.updateUser(userID, userData);
  }

  @Get('/profile/:id')
  async getUserById(@Param('id') id: string) {
    return await this.usersService.getUserById(id);
  }

  @Get('email/:email')
  async getUserByEmail(@Param('email') email: string): Promise<User> {
    return await this.usersService.getUserByEmail(email);
  }

  @Delete('delete/:id')
  //   @ApiBearerAuth()
  //   @Roles(Role.SuperAdmin, Role.Admin)
  //   @UseGuards(AuthGuard, RolesGuard)
  async deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.deleteUser(id);
  }
}
