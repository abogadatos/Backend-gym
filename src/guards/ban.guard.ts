import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BanGuard implements CanActivate {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // Assumes user is already authenticated

    console.log(user.id);

    if (!user) return false;

    const foundUser = await this.userRepo.findOne({ where: { id: user.id } });
    if (foundUser.banned) {
      throw new ForbiddenException(
        `Your account has been banned. Reason: ${user.banReason}`,
      );
    }

    return true;
  }
}
