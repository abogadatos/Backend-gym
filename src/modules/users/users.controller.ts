import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  Query,
  HttpException,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UsrWtoutPasswdInterceptor } from 'src/interceptors/userPasswordRemoval.interceptor';
import { UpdateUserDto } from './dto/updateUser.dto';

@Controller('users')
// Este interceptor elimina la password para que no se muestre cuando se consulte info de users, si no funciona, avisar a @nechodev
@UseInterceptors(UsrWtoutPasswdInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Proteger con roles y guards > nechodev
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

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.createUser(createUserDto);
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return await this.usersService.getUserById(id);
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.usersService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return await this.usersService.deleteUser(id);
  }
}
