import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { GoogleUserDto } from './dto/googleUser.dto';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from './dto/createUser.dto';
import { UserDataDto } from './dto/user.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './dto/JwtPayload.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
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

  // 만들어야 할 함수들
  // invalidate refreshtoken,
  async generateToken(tokenType: string = 'access', email: string) {
    const user = await this.userService.findUserByEmail(email);
    const payload: JwtPayload = {
      uid: user.uid,
      email: user.email,
      permission: user.permission,
    };

    switch (tokenType) {
      case 'access':
        return this.jwtService.sign(payload);
      case 'refresh':
        return this.jwtService.sign(payload, { expiresIn: '7d' });
      default:
        throw new InternalServerErrorException(
          'Unable to generate user token: token type not provided.',
        );
    }
  }

  async refreshTokens(refreshToken: string) {
    const decoded: JwtPayload = this.jwtService.verify(refreshToken);
    const user = await this.userService.findUserByEmail(decoded.email);

    if (!user || user.refreshToken !== refreshToken) {
      throw new UnauthorizedException();
    }

    const newAccessToken = await this.generateToken('access', user.email);
    const newRefreshToken = await this.generateToken('refresh', user.email);
    await this.userService.setRefreshToken(user.email, newRefreshToken);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  // sign out controller에서 사용할 예정
  async invalidateRefreshToken(refreshToken: string) {
    const decoded: JwtPayload = this.jwtService.verify(refreshToken);
    const user = await this.userService.findUserByEmail(decoded.email);

    if (!user || user.refreshToken !== refreshToken) {
      throw new UnauthorizedException();
    }

    await this.userService.removeRefreshToken(user.email);
    return {
      result: true,
    };
  }

  // 여기서 bcrypt 이용해서 비밀번호 맞는지 검사해야 함.
  // case 2 : google or local strategy로 먼저 가입된 user의 경우, 기존 schema를 업데이트 해주는 방향으로 가야 함.
  // case 2의 경우 local auth는 admin page에서만 등록 가능하기 때문에 무조건적인 업데이트를 해줘도 됨.
  // 단, user registration을 google / local 모두 허용하는 경우 local 가입 시 이메일 인증을 필수적으로 진행해야 함.
  async validateUser(id: string, pw: string) {
    return {};
  }
}
