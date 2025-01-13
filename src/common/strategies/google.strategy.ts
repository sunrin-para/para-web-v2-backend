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
      // callbackURL: `${env.HTTP_PROTOCOL}://${env.DOMAIN}${env.GOOGLE_CALLBACK_PARAM}`,
      callbackURL: `${env.DOMAIN}${env.GOOGLE_REDIRECT_URL}`,
      scope: ['profile', 'email'],
    });
  }

  private async isValidEmail(email) {
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
    if (this.isValidEmail(user._json.email)) return done(null, user);
    else throw new ForbiddenException();
  }
}
