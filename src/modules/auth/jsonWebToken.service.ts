//*     SERVICIO DE CREACION DE JSON WEB TOKEN

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Role } from 'src/enum/roles.enum';
import { User } from 'src/database/entities/user.entity';

export interface JWTPayload {
  id: string;
  creatorId: string;
  roles: Role.User;
}

@Injectable()
export class JsonWebTokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateJwt(user): Promise<string> {
    const payload = {
      //! parametros para crear el JWT
      //! con esto se puede implementar un guardian que busque en base de datos la
      //! concordancia entre los datos del token y los datos la DB
      id: user.id,
      name: user.name,
      email: user.email,
      roles: user.roles,
      phone: user.phone,
      country: user.country,
      address: user.address,
      banned: user.banned,
      banSatus: user.banStatus,
      banReason: user.banReason,
    };
    const secret = this.configService.get<string>('jwt.secret');
    const signOptions = this.configService.get<object>('jwt.signOptions');
    return this.jwtService.sign(payload, { secret, ...signOptions });
  }

  async generateCPT(user: User) {
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      roles: user.roles,
      phone: user.phone,
      country: user.country,
      address: user.address,
      banned: user.banned,
      banSatus: user.banStatus,
      banReason: user.banReason,
    };
    const secret = this.configService.get<string>('jwt.secret');
    const signOptions = this.configService.get<object>('jwt.signOptions');
    return this.jwtService.sign(payload, { secret, ...signOptions });
  }

  async verifyJwt(token: string): Promise<any> {
    return this.jwtService.verifyAsync(token);
  }
}
