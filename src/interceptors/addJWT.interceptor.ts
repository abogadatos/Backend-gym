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
      map(async (result) => {
        if (result.userAuth === 'form') {
          console.info(`
            message:
              'User already exist within database. Must login with password',
            userData:
                userID: ${result.userID},
                userName: ${result.userName},
                userEmail: ${result.userEmail},
                userRol: ${result.userRol},
                userAuth: ${result.userAuth},
                userMembershipStatus: ${result.userMembershipStatus},
                userCreatedAt: ${result.userCreatedAt},
                `);
          return {
            message:
              'User already exist within database. Must login with password',
            userData: result,
          };
        }

        try {
          const token = await this.jwtSv.generateJwt(result);
          if (result && result.redirect === true) {
            return { token, result };
          }

          return { user: result, token };
        } catch (error) {
          throw new Error('Error al generar el token');
        }
      }),
    );
  }
}
