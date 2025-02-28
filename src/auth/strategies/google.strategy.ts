import { ForbiddenException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from 'src/auth/auth.service';

const env = process.env;

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${env.DOMAIN}${env.GOOGLE_REDIRECT_PARAM}`,
      scope: ['profile', 'email'],
    });
  }

  private async validateEmailAddr(email) {
    const regex = /^[a-zA-Z0-9._%+-]+@(sunrint\.hs\.kr|sunrin-para\.dev)$/;
    return regex.test(email);
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const user = profile;
    user.accessToken = accessToken;
    user.refreshToken = refreshToken;
    console.log(user._json.email);
    const isValidEmail = await this.validateEmailAddr(user._json.email);
    if (isValidEmail) return done(null, user);
    else throw new ForbiddenException();
  }
}
