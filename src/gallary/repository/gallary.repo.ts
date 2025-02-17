import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GallaryRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async deleteAlbum(albumId: number) {
    await this.prismaService.gallary
      .delete({
        where: { id: albumId },
      })
      .catch((e) => {
        throw new Error(e);
      });
    return true;
  }
}
