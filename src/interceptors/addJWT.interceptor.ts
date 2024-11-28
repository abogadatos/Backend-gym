import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { JsonWebTokenService } from 'src/modules/auth/jsonWebToken.service';

@Injectable()
export class addJWTInterceptor implements NestInterceptor {
  constructor(private readonly jwtSv: JsonWebTokenService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(async (userData) => {
        if (userData.userAuth === 'form') {
          console.info(`
            message:
              'User already exist within database. Must login with password',
            userData:
                userID: ${userData.userID},
                userName: ${userData.userName},
                userEmail: ${userData.userEmail},
                userRol: ${userData.userRol},
                userAuth: ${userData.userAuth},
                userMembershipStatus: ${userData.userMembershipStatus},
                userCreatedAt: ${userData.userCreatedAt},
                `);
          return {
            message:
              'User already exist within database. Must login with password',
            userData: userData,
          };
        }

        try {
          const token = await this.jwtSv.generateJwt(userData);
          if (userData && userData.redirect === true) {
            return { token, userData };
          }

          return { userData, token };
        } catch (error) {
          throw new Error('Error al generar el token');
        }
      }),
    );
  }
}
