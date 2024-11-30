import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      console.warn('AuthGuard: No authorization token provided');
      throw new UnauthorizedException('Authorization token missing');
    }

    try {
      const secret = process.env.JWT_SECRET;
      const userPayload = this.jwtService.verify(token, {
        secret: secret,
      });

      userPayload.exp = new Date(userPayload.exp * 1000);
      userPayload.iat = new Date(userPayload.iat * 1000);

      console.log('Decoded JWT in AuthGuard:', userPayload);

      request.user = userPayload;

      return true;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        console.warn(`User's session has expired`);
        throw new UnauthorizedException(
          `Your session has expired. Please log in again.`,
        );
      }

      console.error('JWT Verification Error:', error);
      throw new UnauthorizedException('Invalid token');
    }

    return;
  }
}
