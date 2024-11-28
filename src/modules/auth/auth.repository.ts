import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class authCustomRepository {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async justRegisteredUser(params) {
    const loggedUser = await this.usersRepository.findOne({
      where: { email: params.email },
    });

    return loggedUser;
  }
}
