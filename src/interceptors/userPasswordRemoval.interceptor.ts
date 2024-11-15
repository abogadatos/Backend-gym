import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class UsrWtoutPasswdInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (Array.isArray(data)) {
          // If the response is an array of users
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          return data.map(({ password, ...rest }) => rest);
        } else if (data && typeof data === 'object') {
          // If the response is a single user object
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { password, ...rest } = data;
          return rest;
        }
        return data;
      }),
    );
  }
}
