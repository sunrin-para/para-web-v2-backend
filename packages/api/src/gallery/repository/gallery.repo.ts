import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { CreateAlbumDto } from '../dto/create-album.dto';
import { UpdateAlbumDto } from '../dto/update-album.dto';

@Injectable()
export class GalleryRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findById(albumId: number) {
    const album = await this.prismaService.gallery
      .findFirst({
        where: { id: albumId },
      })
      .catch((e) => {
        throw new Error(e);
      });
    return album;
  }

  async createAlbum(createAlbumDto: CreateAlbumDto, fileUrls: Array<string>) {
    const album = await this.prismaService.gallery
      .create({
        data: { photos: fileUrls, ...createAlbumDto },
      })
      .catch((e) => {
        throw new Error(e);
      });
    return album;
  }

  async getAlbumDetail(albumId: number) {
    const album = await this.prismaService.gallery
      .findUnique({
        where: { id: albumId },
      })
      .catch((e) => {
        throw new Error(e);
      });
    return album;
  }

  async getAlbumsByYear(year: number) {
    const albums = await this.prismaService.gallery
      .findMany({
        where: {
          AND: [
            { date: { gte: new Date(year, 0, 1) } },
            { date: { lt: new Date(year + 1, 0, 1) } },
          ],
        },
      })
      .catch((e) => {
        throw new Error(e);
      });
    return albums;
  }

  async getAllAlbums() {
    const albums = await this.prismaService.gallery
      .findMany({
        orderBy: {
          date: 'desc',
        },
      })
      .catch((e) => {
        throw new Error(e);
      });
    return albums;
  }

  async updateAlbum(
    albumId: number,
    updateAlbumDto: UpdateAlbumDto,
    photosArray: Array<string>,
  ) {
    const album = await this.prismaService.gallery
      .update({
        where: { id: albumId },
        data: { photos: photosArray, ...updateAlbumDto },
      })
      .catch((e) => {
        throw new Error(e);
      });
    return album;
  }

  async deleteAlbum(albumId: number) {
    await this.prismaService.gallery
      .delete({
        where: { id: albumId },
      })
      .catch((e) => {
        throw new Error(e);
      });
    return true;
  }
}
