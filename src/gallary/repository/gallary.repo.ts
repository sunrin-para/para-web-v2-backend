import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAlbumDto } from '../dto/create-album.dto';

@Injectable()
export class GallaryRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createAlbum(createAlbumDto: CreateAlbumDto, fileUrls: Array<string>) {
    const album = await this.prismaService.gallary
      .create({
        data: { photos: fileUrls, ...createAlbumDto },
      })
      .catch((e) => {
        throw new Error(e);
      });
    return album;
  }

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
