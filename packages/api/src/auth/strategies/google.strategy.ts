import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { GoogleUserDto } from '../dto/google-user.dto';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: `${configService.get<string>('DOMAIN')}${configService.get<string>('GOOGLE_REDIRECT_PARAM')}`,
      scope: ['profile', 'email'],
      passReqToCallback: true,
    });
  }

  private async validateEmailAddr(email) {
    return new RegExp(
      '^[a-zA-Z0-9._%+-]+@(sunrint\.hs\.kr|sunrin-para\.dev)$',
    ).test(email);
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const isValidEmail = await this.validateEmailAddr(profile._json.email);
    if (!isValidEmail) {
      throw new ForbiddenException(
        '선린인터넷고 또는 PARA 도메인을 이용하지 않는 사용자는 접근할 수 없습니다.',
      );
    }

    const user = new GoogleUserDto();
    user.email = profile._json.email;
    user.accessToken = accessToken;

    return done(null, user);
  }
}
