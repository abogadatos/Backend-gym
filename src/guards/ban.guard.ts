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
    const { email } = request.body;
    console.log(`User in BanGuard:, ${email}`);

    if (!email) {
      console.log({
        message: `The user you're looking for wasn't found`,
        userEmail: email,
      });
      throw new ForbiddenException('Email is required to log in.');
    }

    const foundUser = await this.userRepo.findOne({ where: { email: email } });
    if (foundUser && foundUser.banned === true) {
      console.log({
        message: `Your account has been banned. Reason: ${foundUser.banReason || 'no reason provided'}`,
        userData: foundUser,
      });
      throw new ForbiddenException(
        `Your account has been banned. Reason: ${foundUser.banReason || 'no reason provided'}`,
      );
    }

    return true;
  }
}
