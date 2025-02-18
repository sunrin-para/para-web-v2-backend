import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/auth/dto/createUser.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Permission as PrismaPermission, User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { UserDataDto } from 'src/auth/dto/user.dto';
import { Permission as PermissionEnum } from 'src/common/enums/Permission.enum';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(userDto: CreateUserDto): Promise<UserDataDto> {
    try {
      let encryptedPassword;
      if (userDto.password) {
        const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUND));
        encryptedPassword = await bcrypt.hash(userDto.password, salt);
      }
      const user = await this.prismaService.user.create({
        data: {
          email: userDto.email,
          name: userDto.name,
          password: encryptedPassword ?? null,
          permission: PrismaPermission[userDto.permission ?? 'USER'],
        },
      });
      return user;
    } catch (e) {
      throw new Error(e);
    }
  }

  async findUserByEmail(email: string): Promise<UserDataDto | null> {
    return (
      (await this.prismaService.user.findUnique({
        where: { email: email },
      })) ?? null
    );
  }

  async changePassword(email: string, password: string) {
    const salt = await bcrypt.genSalt(process.env.SALT_ROUND);
    const encryptedPassword = await bcrypt.hash(password, salt);
    await this.prismaService.user
      .update({
        where: { email: email },
        data: { password: encryptedPassword },
      })
      .then(() => {
        return true;
      })
      .catch((e) => {
        throw new Error(e);
      });
  }

  async changePermission(email: string, newPermission: PermissionEnum) {
    await this.prismaService.user
      .update({
        where: { email: email },
        data: { permission: PrismaPermission[newPermission] },
      })
      .catch((e) => {
        throw new Error(e);
      });
    return true;
  }

  async deleteAccount(email: string) {
    await this.prismaService.user
      .delete({
        where: { email: email },
      })
      .catch((e) => {
        throw new Error(e);
      });
    return true;
  }

  async setValidationKey(email: string, valKey: string) {
    await this.prismaService.user
      .update({
        where: { email: email },
        data: { validationKey: valKey },
      })
      .then(() => {
        return true;
      })
      .catch((e) => {
        throw new Error(e);
      });
  }

  async removeValidationKey(email: string) {
    await this.prismaService.user
      .update({
        where: { email: email },
        data: { validationKey: null },
      })
      .then(() => {
        return true;
      })
      .catch((e) => {
        throw new Error(e);
      });
  }

  async setRefreshToken(email: string, refreshToken: string) {
    await this.prismaService.user
      .update({
        where: { email: email },
        data: { refreshToken: refreshToken },
      })
      .then(() => {
        return true;
      })
      .catch((e) => {
        throw new Error(e);
      });
  }

  async removeRefreshToken(email: string) {
    await this.prismaService.user
      .update({
        where: { email: email },
        data: { refreshToken: null },
      })
      .then(() => {
        return true;
      })
      .catch((e) => {
        throw new Error(e);
      });
  }
}
