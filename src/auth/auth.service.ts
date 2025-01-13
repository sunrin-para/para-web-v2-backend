import { Injectable } from '@nestjs/common';
import { GoogleUserDto } from './dto/googleUser.dto';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from './dto/createUser.dto';
import { UserDataDto } from './dto/user.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}
  async handleGoogleSignIn(googleUser: GoogleUserDto) {
    let user: UserDataDto = await this.userService.findUserByEmail(
      googleUser.email,
    );
    if (!user) {
      const newUserData: CreateUserDto = {
        email: googleUser.email,
        name: googleUser.name,
      };
      user = await this.userService.createUser(newUserData);
    }
    return user;
  }

  // 여기서 bcrypt 이용해서 비밀번호 맞는지 검사해야 함.
  // case 2 : google or local strategy로 먼저 가입된 user의 경우, 기존 schema를 업데이트 해주는 방향으로 가야 함.
  // case 2의 경우 local auth는 admin page에서만 등록 가능하기 때문에 무조건적인 업데이트를 해줘도 됨.
  // 단, user registration을 google / local 모두 허용하는 경우 local 가입 시 이메일 인증을 필수적으로 진행해야 함.
  async validateUser(id: string, pw: string) {
    return {};
  }
}
