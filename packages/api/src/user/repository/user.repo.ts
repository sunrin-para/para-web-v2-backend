import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { Permission as PrismaPermission } from '@sunrin-para/database';
import { Permission as PermissionEnum } from '@/common/enums/Permission.enum';

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findUserByEmail(email: string) {
    try {
      return await this.prismaService.user.findUnique({
        where: { email },
      });
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async createUser(
    email: string,
    name: string,
    permission: PrismaPermission,
    password: string = null,
  ) {
    try {
      return await this.prismaService.user.create({
        data: { email, name, password, permission },
      });
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async changePassword(email: string, password: string) {
    try {
      await this.prismaService.user.update({
        where: { email },
        data: { password },
      });
      return true;
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async changePermission(email: string, permission: PermissionEnum) {
    try {
      await this.prismaService.user.update({
        where: { email },
        data: { permission: PrismaPermission[permission] },
      });
      return true;
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async deleteAccount(email: string) {
    try {
      await this.prismaService.user.delete({
        where: { email: email },
      });
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
