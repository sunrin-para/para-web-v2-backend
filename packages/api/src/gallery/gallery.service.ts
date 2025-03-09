import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GalleryRepository } from './repository/gallery.repo';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { MonoAlbumDto } from './dto/mini-album.dto';

@Injectable()
export class GalleryService {
  constructor(private readonly galleryRepository: GalleryRepository) {}

  async createAlbum(createAlbumDto: CreateAlbumDto) {
    if (createAlbumDto.photos.length < 1) {
      throw new BadRequestException(
        '등록할 앨범에 사진이 포함되지 않았습니다.',
      );
    }
    return await this.galleryRepository.createAlbum(createAlbumDto);
  }

  async getAlbumDetail(albumId: number) {
    return await this.galleryRepository.getAlbumDetail(albumId);
  }

  async getAlbumsByYear(year: number) {
    if (year < 2000) {
      throw new BadRequestException('2000년 이전의 앨범은 조회할 수 없습니다.');
    }
    return await this.galleryRepository.getAlbumsByYear(year);
  }

  async getAllAlbums() {
    const albums = await this.galleryRepository.getAllAlbums();
    const albumsByYear = new Map<number, MonoAlbumDto[]>();

    albums.forEach((album) => {
      const year = album.date.getFullYear();
      if (!albumsByYear.has(year)) {
        albumsByYear.set(year, []);
      }

      albumsByYear.get(year).push({
        title: album.title,
        date: album.date,
        thumbnailUrl: album.photos[0],
      });
    });

    return Array.from(albumsByYear.entries())
      .map(([year, albums]) => ({
        year,
        albums,
      }))
      .sort((a, b) => b.year - a.year);
  }

  async updateAlbum(albumId: number, updateAlbumDto: UpdateAlbumDto) {
    const album = await this.galleryRepository.findById(albumId);
    if (!album) {
      throw new NotFoundException('Album not found');
    }

    return await this.galleryRepository.updateAlbum(albumId, updateAlbumDto);
  }

  async deleteAlbum(albumId: number) {
    return await this.galleryRepository.deleteAlbum(albumId);
  }
}
