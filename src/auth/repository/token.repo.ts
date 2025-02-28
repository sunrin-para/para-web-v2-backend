import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class TokenRepository {
  constructor(private readonly prismaService: PrismaService) {}

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
