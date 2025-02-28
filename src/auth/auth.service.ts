import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from './dto/createUser.dto';
import { UserDataDto } from './dto/user.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './dto/JwtPayload.dto';
import { SignInDto } from './dto/signIn.dto';
import * as bcrypt from 'bcryptjs';
import {
  ChangePasswordDto,
  ChangePermissionDto,
} from './dto/changeInformations.dto';
import { Permission } from 'src/common/enums/Permission.enum';
import { Permission as PrismaPermission } from '@prisma/client';
import * as crypto from 'crypto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { AuthRepository } from './repository/auth.repo';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
    private readonly authRepository: AuthRepository,
  ) {}
  async handleGoogleSignIn(email: string, userName: string) {
    let user: UserDataDto = await this.authRepository.findUserByEmail(email);
    if (!user) {
      const newUserData: CreateUserDto = {
        email: email,
        name: userName,
      };
      user = await this.authRepository.createUser(newUserData);
    }

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

    await this.userService.setRefreshToken(user.email, refreshToken);
    await this.userService.setValidationKey(user.email, validationKey);

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  async registerUser(createUserDto: CreateUserDto) {
    let user: UserDataDto = await this.authRepository.findUserByEmail(
      createUserDto.email,
    );
    if (user) {
      await this.integrateAccount(
        createUserDto.email,
        createUserDto.permission,
      ).catch((e) => {
        throw new Error(e);
      });
      const editedUser = await this.authRepository.findUserByEmail(
        createUserDto.email,
      );
      return editedUser;
    } else {
      const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUND));
      const encryptedPassword = await bcrypt.hash(createUserDto.password, salt);
      createUserDto.password = encryptedPassword;
      user = await this.authRepository.createUser(createUserDto);
      return user;
    }
  }

  async handleSignIn(signInDto: SignInDto) {
    const user = await this.authRepository.findUserByEmail(signInDto.email);
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

      await this.userService.setRefreshToken(user.email, refreshToken);
      await this.userService.setValidationKey(user.email, validationKey);

      return {
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
    }
    throw new UnauthorizedException();
  }

  /**
   *
   * @param email string
   * @param existingAccountType string
   * @param adminPermission string
   * @description Admin 계정 등록 시, 이미 구글 계정이 등록되어 있다면 해당 계정과 통합시키는 함수입니다.
   * @returns Boolean
   */
  private async integrateAccount(email: string, adminPermission: string) {
    await this.authRepository.changePermission(
      email,
      Permission[adminPermission],
    );
    return true;
  }

  async changePassword(email: string, changePasswordDto: ChangePasswordDto) {
    if (
      email !== changePasswordDto.email ||
      !(await this.authRepository.findUserByEmail(email))
    ) {
      throw new BadRequestException();
    }
    const salt = await bcrypt.genSalt(process.env.SALT_ROUND);
    const encryptedPassword = await bcrypt.hash(
      changePasswordDto.newPassword,
      salt,
    );
    const result = await this.authRepository
      .changePassword(email, encryptedPassword)
      .then(async () => {
        await this.signOut(email);
      });
    return result;
  }

  async generateDefaultAdminAccount() {
    const existingAdmin = await this.prismaService.user
      .findFirstOrThrow({
        where: { permission: PrismaPermission.SUPER },
      })
      .catch((e) => {});
    if (!existingAdmin) {
      const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUND));
      const encryptedPassword = await bcrypt.hash(
        process.env.DEFAULT_ADMIN_PW,
        salt,
      );
      await this.authRepository.createUser({
        email: 'dev.juany@gmail.com',
        name: 'PARA Admin',
        permission: PrismaPermission.SUPER,
        password: encryptedPassword,
      });
      return true;
    }
    throw new ConflictException('계정이미존재함.');
  }

  async changePermission(changePermissionDto: ChangePermissionDto) {
    await this.authRepository
      .changePermission(
        changePermissionDto.email,
        changePermissionDto.newPermission,
      )
      .then(async () => {
        await this.signOut(changePermissionDto.email);
      })
      .catch((e) => {
        throw new Error(e);
      });
  }

  async signOut(email: string) {
    const user = await this.authRepository.findUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException();
    }

    await this.userService.removeRefreshToken(user.email);
    await this.userService.removeValidationKey(user.email);

    return {
      result: true,
    };
  }

  async deleteAccount(email: string) {
    return await this.authRepository.deleteAccount(email);
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
    const user = await this.authRepository.findUserByEmail(email);

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
    const user = await this.authRepository.findUserByEmail(decoded.email);

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
