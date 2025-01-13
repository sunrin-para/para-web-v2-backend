import { Injectable } from '@nestjs/common';
import { GoogleUserDto } from './dto/googleUser.dto';

@Injectable()
export class AuthService {
  async handleSignIn(user: GoogleUserDto) {}

  async validateUser(id: string, pw: string) {
    return {};
  }
}
