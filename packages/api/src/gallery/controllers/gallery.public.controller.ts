import { Controller, Get, Param } from '@nestjs/common'
import { GalleryService } from '@/gallery/gallery.service'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'
import { AlbumDto } from '@/gallery/dto/album.dto'
import { MonoAlbumDto } from '@/gallery/dto/mini-album.dto'

@Controller('gallery')
export class GalleryPublicController {
  constructor(private readonly galleryService: GalleryService) {}

  @ApiOperation({ summary: '앨범 상세 조회' })
  @ApiResponse({ type: AlbumDto })
  @Get('/detail/:albumUUID')
  async getAlbumDetail(@Param('albumId') albumUUID: string) {
    return await this.galleryService.getAlbumDetail(albumUUID)
  }

  @ApiOperation({ summary: '모든 앨범 조회' })
  @ApiResponse({ type: MonoAlbumDto, isArray: true })
  @Get()
  async getAllAlbums() {
    return await this.galleryService.getAllAlbums()
  }

  @ApiOperation({ summary: '연도별 앨범 조회' })
  @ApiResponse({ type: MonoAlbumDto, isArray: true })
  @Get('/year/:year')
  async getAlbumsByYear(@Param('year') year: number) {
    return await this.galleryService.getAlbumsByYear(year)
  }
}
