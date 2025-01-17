import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { GoogleUserDto } from './dto/googleUser.dto';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from './dto/createUser.dto';
import { UserDataDto } from './dto/user.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './dto/JwtPayload.dto';
import { SignInDto } from './dto/signIn.dto';
import bcrypt from 'bcryptjs';
import { ChangePasswordDto } from './dto/changePassword.dto';

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

    const accessToken = await this.generateToken('access', user.email);
    const refreshToken = await this.generateToken('refresh', user.email);

    await this.userService.setRefreshToken(user.email, refreshToken);

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  async registerUser(createUserDto: CreateUserDto) {
    let user: UserDataDto = await this.userService.findUserByEmail(
      createUserDto.email,
    );
    if (user) throw new ConflictException('Account already Exists');
    else {
      user = await this.userService.createUser(createUserDto);
      return user;
    }
  }

  async handleSignIn(signInDto: SignInDto) {
    const user = await this.userService.findUserByEmail(signInDto.email);
    if (!user) throw new NotFoundException();

    const match = await bcrypt.compare(user.password, signInDto.password);
    if (match) {
      const accessToken = await this.generateToken('access', user.email);
      const refreshToken = await this.generateToken('refresh', user.email);

      await this.userService.setRefreshToken(user.email, refreshToken);

      return {
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
    }
    throw new UnauthorizedException();
  }

  async changePassword(email: string, changePasswordDto: ChangePasswordDto) {
    if (
      email !== changePasswordDto.email ||
      !(await this.userService.findUserByEmail(email))
    ) {
      throw new BadRequestException();
    }
    const result = await this.userService.changePassword(
      email,
      changePasswordDto.newPassword,
    );
    return result;
  }

  async signOut(email: string) {
    await this.invalidateRefreshToken(email);
  }

  /* 여기서부터 토큰 관리 함수들입니다. */
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
          'Unable to generate user token: token type was not provided.',
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
  async invalidateRefreshToken(email: string) {
    const user = await this.userService.findUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException();
    }

    await this.userService.removeRefreshToken(user.email);
    return {
      result: true,
    };
  }
  /* 여기까지 토큰 관리 함수들입니다. */
}
