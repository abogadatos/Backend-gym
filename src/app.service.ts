import { Injectable, OnModuleInit } from '@nestjs/common';
import { UsersService } from './modules/users/users.service';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private usersService: UsersService) {}

  async onModuleInit() {
    this.usersService.seedDatabase();
  }

  getHello(): string {
    return 'holiii!';
  }
}
