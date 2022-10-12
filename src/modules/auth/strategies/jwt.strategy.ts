import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import type { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { ConfigService } from '@/common';

import type { JwtPayload, JwtSign, Payload } from '../auth.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(configService: ConfigService) {
    super({
      ignoreExpiration: false,
      secretOrKey: configService.get('auth.jwtSecret'),
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request): string | null => {
          const data = (<Partial<JwtSign>>request.cookies)?.access_token;
          if (!data) {
            return null;
          }
          return data;
        },
      ]),
    });
  }

  public validate(payload: JwtPayload | null): Payload {
    if (payload === null) {
      throw new UnauthorizedException();
    }
    return { userId: payload.sub, username: payload.username, role: payload.role };
  }
}
