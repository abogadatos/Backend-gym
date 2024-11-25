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

  async generateJwt(user: JWTPayload): Promise<string> {
    const payload = {
      //! parametros para crear el JWT
      //! con esto se puede implementar un guardian que busque en base de datos la
      //! concordancia entre los datos del token y los datos la DB
      id: user.id,
      creatorId: user.creatorId,
      role: user.roles, //! ==> INCLUCION DEL ROL
    };
    const secret = this.configService.get<string>('jwt.secret');
    const signOptions = this.configService.get<object>('jwt.signOptions');
    return this.jwtService.sign(payload, { secret, ...signOptions });
  }

  async generateCPT(user: User) {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.roles,
    };
    const secret = this.configService.get<string>('jwt.secret');
    const signOptions = this.configService.get<object>('jwt.signOptions');
    return this.jwtService.sign(payload, { secret, ...signOptions });
  }

  async verifyJwt(token: string): Promise<any> {
    return this.jwtService.verifyAsync(token);
  }
}
