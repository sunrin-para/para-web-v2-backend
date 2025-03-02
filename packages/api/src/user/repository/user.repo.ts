import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { Permission as PrismaPermission } from '@sunrin-para/database';
import { Permission as PermissionEnum } from '@/common/enums/Permission.enum';
import { UserDataDto } from '@/auth/dto/user.dto';

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findUserByEmail(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });
    return user ?? null;
  }

  // repo에서 암호화 안 하므로 service에서 암호화하고 보내야 함.
  async createUser(
    email: string,
    name: string,
    permission: PrismaPermission,
    password?: string,
  ): Promise<UserDataDto> {
    const user = await this.prismaService.user
      .create({
        data: {
          email: email,
          name: name,
          password: password ?? null,
          permission: permission,
        },
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
