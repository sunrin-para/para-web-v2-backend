import { Controller, Get, HttpCode, Param } from '@nestjs/common';
import { GalleryService } from '@/gallery/gallery.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('gallery')
export class GalleryPublicController {
  constructor(private readonly galleryService: GalleryService) {}
  @Get('/detail/:albumId')
  @ApiResponse({
    status: 200,
    description: '앨범 상세 조회 성공',
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        date: { type: 'string' },
        photos: {
          type: 'array',
          items: {
            type: 'string',
          },
        },
      },
    },
  })
  async getAlbumDetail(@Param('albumId') albumId: number) {
    return await this.galleryService.getAlbumDetail(albumId);
  }

  @ApiOperation({ summary: '모든 앨범 조회' })
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: '모든 앨범 조회 성공',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          year: { type: 'number' },
          albums: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'number' },
                title: { type: 'string' },
                date: { type: 'string' },
                thumbnailUrl: { type: 'string' },
              },
            },
          },
        },
      },
    },
  })
  @Get()
  async getAllAlbums() {
    return await this.galleryService.getAllAlbums();
  }

  @ApiOperation({ summary: '연도별 앨범 조회' })
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: '연도별 앨범 조회 성공',
    schema: {
      type: 'object',
      properties: {
        year: { type: 'number' },
        albums: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              title: { type: 'string' },
              date: { type: 'string' },
              thumbnailUrl: { type: 'string' },
            },
          },
        },
      },
    },
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
