import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class TokenRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async setValidationKey(email: string, validationKey: string) {
    try {
      return await this.prismaService.user.update({
        where: { email },
        data: { validationKey },
      });
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async removeValidationKey(email: string) {
    try {
      return await this.prismaService.user.update({
        where: { email },
        data: { validationKey: null },
      });
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async setRefreshToken(email: string, refreshToken: string) {
    try {
      return await this.prismaService.user.update({
        where: { email },
        data: { refreshToken },
      });
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async removeRefreshToken(email: string) {
    try {
      return await this.prismaService.user.update({
        where: { email },
        data: { refreshToken: null },
      });
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
