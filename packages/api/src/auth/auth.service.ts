import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '@/user/user.service';
import { CreateUserDto } from './dto/createUser.dto';
import { UserDataDto } from './dto/user.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './dto/JwtPayload.dto';
import { SignInDto } from './dto/signIn.dto';
import * as bcrypt from 'bcryptjs';
import { Permission as PermissionEnum } from '@/common/enums/Permission.enum';
import * as crypto from 'crypto';
import { TokenRepository } from './repository/token.repo';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly tokenRepository: TokenRepository,
  ) {}
  async handleGoogleSignIn(email: string, userName: string) {
    let user: UserDataDto =
      (await this.userService.findUserByEmail(email)) ??
      (await this.userService.createUser(email, userName));

    const validationKey = await this.generateValidationKey();

    const accessToken = await this.generateToken(
      'access',
      user.email,
      validationKey,
    );
    const refreshToken = await this.generateToken(
      'refresh',
      user.email,
      validationKey,
    );

    await this.tokenRepository.setRefreshToken(user.email, refreshToken);
    await this.tokenRepository.setValidationKey(user.email, validationKey);

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  async registerUser(createUserDto: CreateUserDto) {
    return await this.userService.createUser(
      createUserDto.email,
      createUserDto.name,
      PermissionEnum[createUserDto.permission],
      createUserDto.password,
    );
  }

  async handleSignIn(signInDto: SignInDto) {
    const user = await this.userService.findUserByEmail(signInDto.email);
    if (!user) throw new BadRequestException();

    const match = await bcrypt.compare(signInDto.password, user.password);
    if (match) {
      const validationKey = await this.generateValidationKey();

      const accessToken = await this.generateToken(
        'access',
        user.email,
        validationKey,
      );
      const refreshToken = await this.generateToken(
        'refresh',
        user.email,
        validationKey,
      );

      await this.tokenRepository.setRefreshToken(user.email, refreshToken);
      await this.tokenRepository.setValidationKey(user.email, validationKey);

      return {
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
    }
    throw new UnauthorizedException();
  }

  async signOut(email: string) {
    const user = await this.userService.findUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException();
    }

    await this.tokenRepository.removeRefreshToken(user.email);
    await this.tokenRepository.removeValidationKey(user.email);

    return {
      result: true,
    };
  }

  /* 여기서부터 토큰 관리 함수들입니다. */
  private async generateValidationKey(length: number = 32) {
    return crypto.randomBytes(length).toString('hex');
  }

  private async generateToken(
    tokenType: string = 'access',
    email: string,
    validationKey: string,
  ) {
    const user = await this.userService.findUserByEmail(email);

    const payload: JwtPayload = {
      uid: user.uid,
      email: user.email,
      permission: user.permission,
      validationKey: validationKey,
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

  async refreshAccessToken(refreshToken: string) {
    const decoded: JwtPayload = this.jwtService.verify(refreshToken);
    const user = await this.userService.findUserByEmail(decoded.email);

    if (!user || user.refreshToken !== refreshToken) {
      throw new UnauthorizedException();
    }

    const newAccessToken = await this.generateToken(
      'access',
      user.email,
      user.validationKey,
    );

    return {
      accessToken: newAccessToken,
    };
  }
  /* 여기까지 토큰 관리 함수들입니다. */
}
