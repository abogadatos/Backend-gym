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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UsrWtoutPasswdInterceptor } from 'src/interceptors/userPasswordRemoval.interceptor';

@Controller('users')
// Este interceptor elimina la password para que no se muestre cuando se consulte info de users, si no funciona, avisar a @nechodev
@UseInterceptors(UsrWtoutPasswdInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Proteger con roles y guards > nechodev
  @Get()
  userGetter(@Query('page') page: string, @Query('limit') limit: string) {
    try {
      const pageQuery = Number(page);
      const limitQuery = Number(limit);
      if (pageQuery && limitQuery) {
        return this.usersService.getUsers(pageQuery, limitQuery);
      } else return this.usersService.getUsers(1, 5);
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

  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto); // Llama al servicio para crear el usuario
  }
  // @Put()
  // updateUser() {
  //   return this.usersService.update();
  // }

  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
