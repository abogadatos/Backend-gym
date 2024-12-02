import { Injectable } from '@nestjs/common';
import { UsersService } from './modules/users/users.service';

@Injectable()
export class AppService {
  constructor(private usersService: UsersService) {}

  getHello(): string {
    return 'holiii!';
  }
}
