import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || '293hefkjxdr@',
    });
  }

  async validate(payload: any) {
    if (!payload || !payload.uid) {
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }

    return {
      uid: payload.uid,
      email: payload.email,
      permission: payload.permission,
      validationKey: payload.validationKey,
    };
  }
}
