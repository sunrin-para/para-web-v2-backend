import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { CreateAlbumDto } from '../dto/create-album.dto';
import { UpdateAlbumDto } from '../dto/update-album.dto';

@Injectable()
export class GalleryRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findById(id: string) {
    try {
      return await this.prismaService.gallery.findUnique({
        where: { id },
      });
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async createAlbum(data: CreateAlbumDto) {
    try {
      return await this.prismaService.gallery.create({ data });
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async getAlbumDetail(id: string) {
    try {
      return await this.prismaService.gallery.findUnique({
        where: { id },
      });
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async getAlbumsByYear(year: number) {
    try {
      return await this.prismaService.gallery.findMany({
        where: {
          AND: [
            { date: { gte: new Date(year, 0, 1) } },
            { date: { lt: new Date(year + 1, 0, 1) } },
          ],
        },
      });
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async getAllAlbums() {
    try {
      return await this.prismaService.gallery.findMany({
        orderBy: {
          date: 'desc',
        },
      });
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async addMemberToAlbum(albumId: string, memberId: string) {
    try {
      return await this.prismaService.gallery.update({
        where: { id: albumId },
        data: {
          participations: {
            create: {
              memberId: memberId,
            },
          },
        },
        include: {
          participations: {
            include: {
              member: true,
            },
          },
        },
      });
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async updateAlbum(id: string, data: UpdateAlbumDto) {
    try {
      return await this.prismaService.gallery.update({
        where: { id },
        data,
      });
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async deleteAlbum(id: string) {
    try {
      await this.prismaService.gallery.delete({
        where: { id },
      });
      return true;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async deleteMemberFromAlbum(albumId: string, memberId: string) {
    try {
      return await this.prismaService.gallery.update({
        where: { id: albumId },
        data: {
          participations: {
            delete: {
              galleryId_memberId: {
                galleryId: albumId,
                memberId: memberId,
              },
            },
          },
        },
        include: {
          participations: {
            include: {
              member: true,
            },
          },
        },
      });
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
