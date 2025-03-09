import { Controller, Get, Param } from '@nestjs/common';
import { GalleryService } from '@/gallery/gallery.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('gallery')
export class GalleryPublicController {
  constructor(private readonly galleryService: GalleryService) {}
  @Get('/detail/:albumId')
  async getAlbumDetail(@Param('albumId') albumId: number) {
    return await this.galleryService.getAlbumDetail(albumId);
  }

  @ApiOperation({ summary: '모든 앨범 조회' })
  @ApiResponse({
    status: 200,
    description: '모든 앨범 조회 성공',
  })
  @Get()
  async getAllAlbums() {
    return await this.galleryService.getAllAlbums();
  }

  @ApiOperation({ summary: '연도별 앨범 조회' })
  @ApiResponse({
    status: 200,
    description: '연도별 앨범 조회 성공',
  })
  @Get('/year/:year')
  async getAlbumsByYear(@Param('year') year: number) {
    const albums = await this.galleryService.getAlbumsByYear(year);
    return {
      year,
      albums: albums.map((album) => ({
        title: album.title,
        date: album.date,
        thumbnailUrl: album.photos[0], // 첫 번째 사진을 썸네일로 사용
      })),
    };
  }
}
