import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { Permission as PrismaPermission } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { UserDataDto } from 'src/auth/dto/user.dto';
import { Permission as PermissionEnum } from 'src/common/enums/Permission.enum';
import { UserRepository } from './repository/user.repo';
import { ConfigService } from '@nestjs/config';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {}
  async findUserByEmail(email: string): Promise<UserDataDto | null> {
    return await this.userRepository.findUserByEmail(email);
  }

  async createUser(
    email: string,
    name: string,
    permission: PermissionEnum = PermissionEnum['USER'],
    password?: string,
  ) {
    let user: UserDataDto = await this.findUserByEmail(email);
    if (user && user.password) {
      // 계정 integration이 불가능한 상황에서 Exception 발생.
      throw new ConflictException('이미 계정이 존재합니다.');
    }
    const salt = await bcrypt.genSalt(
      this.configService.get<number>('SALT_ROUND'),
    );
    password = await bcrypt.hash(password, salt);
    if (user) {
      await this.integrateAccount(email, permission, password);
      return await this.findUserByEmail(email);
    } else {
      return await this.userRepository.createUser(
        email,
        name,
        PrismaPermission[permission],
        password,
      );
    }
  }

  private async integrateAccount(
    email: string,
    adminPermission: PermissionEnum,
    password: string,
  ) {
    await this.userRepository.changePermission(email, adminPermission);
    await this.userRepository.changePassword(email, password);
    return true;
  }

  async changePassword(
    changerEmail: string,
    userEmail: string,
    newPassword: string,
  ) {
    if (
      (changerEmail !== userEmail &&
        (await this.findUserByEmail(changerEmail)).permission !== 'SUPER') ||
      !this.findUserByEmail(userEmail)
    ) {
      throw new BadRequestException();
    }
    const salt = await bcrypt.genSalt(
      this.configService.get<number>('SALT_ROUND'),
    );
    const encryptedPassword = await bcrypt.hash(newPassword, salt);
    const result = await this.userRepository
      .changePassword(userEmail, encryptedPassword)
      .then(async () => {
        await this.authService.signOut(userEmail);
      });
    return result;
  }

  async changePermission(email: string, newPermission: PermissionEnum) {
    await this.userRepository
      .changePermission(email, newPermission)
      .then(async () => {
        await this.authService.signOut(email);
      })
      .catch((e) => {
        throw new Error(e);
      });
  }

  async deleteAccount(email: string) {
    return await this.userRepository.deleteAccount(email);
  }
}
