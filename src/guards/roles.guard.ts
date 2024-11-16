import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/enum/roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      console.log(`Not required roles.`);
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    // console.log('User in RolesGuard:', user);
    // console.log(`USER: ${user}`);

    const hasRole = () => {
      // Check if roles is an array or a string
      if (Array.isArray(user.roles)) {
        return requiredRoles.some((role) => user.roles.includes(role));
      } else {
        return requiredRoles.includes(user.roles); // Handle the case where roles is a string
      }
    };

    const valid = user && user.roles && hasRole();
    console.log(`USER ROLE in RolesGuard: ${user.roles}`);
    console.log('Has Role:', valid); // Debugging

    if (!valid) {
      throw new ForbiddenException(
        'You do not have permission and you are not allowed to access this resource',
      );
    }

    return valid;
  }
}
