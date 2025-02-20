import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { Permission as PermissionEnum } from 'src/common/enums/Permission.enum';
import { Permission as PrismaPermission, User } from '@prisma/client';
import { CreateUserDto } from '../dto/createUser.dto';
import { UserDataDto } from '../dto/user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthRepository {
  constructor(private readonly prismaService: PrismaService) {}

  // repo에서 암호화 안 하므로 service에서 암호화하고 보내야 함.
  async createUser(userDto: CreateUserDto): Promise<UserDataDto> {
    const user = await this.prismaService.user
      .create({
        data: {
          email: userDto.email,
          name: userDto.name,
          password: userDto.password ?? null,
          permission: PrismaPermission[userDto.permission ?? 'USER'],
        },
      })
      .catch((e) => {
        throw new Error(e);
      });
    return user;
  }

  async findUserByEmail(email: string) {
    const user = await this.prismaService.user
      .findUnique({
        where: { email: email },
      })
      .catch((e) => {
        throw new Error(e);
      });
    return user;
  }

  async changePassword(email: string, newPassword: string) {
    await this.prismaService.user
      .update({
        where: { email: email },
        data: { password: newPassword },
      })
      .catch((e) => {
        throw new Error(e);
      });
    return true;
  }

  async changePermission(email: string, permission: PermissionEnum) {
    await this.prismaService.user
      .update({
        where: { email: email },
        data: { permission: PrismaPermission[permission] },
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
}
