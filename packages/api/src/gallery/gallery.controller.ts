import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  SetMetadata,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { GalleryService } from './gallery.service';
import { AdminGuard } from '@/auth/guards/admin.guard';
import { CreateAlbumDto } from './dto/create-album.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UpdateAlbumDto } from './dto/update-album.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('gallery')
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @ApiOperation({ summary: '앨범 생성' })
  @ApiResponse({
    status: 200,
    description: '앨범 생성 성공',
  })
  @ApiBody({ type: CreateAlbumDto })
  @ApiBearerAuth()
  @Post()
  @UseGuards(AdminGuard)
  @SetMetadata('permission', 'MANAGER')
  @UseInterceptors(FilesInterceptor('files'))
  async createAlbum(
    @Body() createAlbumDto: CreateAlbumDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    return await this.galleryService.createAlbum(createAlbumDto);
  }

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

  @ApiOperation({ summary: '앨범 수정' })
  @ApiResponse({
    status: 200,
    description: '앨범 수정 성공',
  })
  @ApiBody({ type: UpdateAlbumDto })
  @ApiBearerAuth()
  @Patch('/:albumId')
  @UseGuards(AdminGuard)
  @SetMetadata('permission', 'MANAGER')
  @UseInterceptors(FilesInterceptor('files'))
  async updateAlbum(
    @Param('albumId') albumId: number,
    @Body() updateAlbumDto: UpdateAlbumDto,
  ) {
    return await this.galleryService.updateAlbum(albumId, updateAlbumDto);
  }

  @ApiOperation({ summary: '앨범 삭제' })
  @ApiResponse({
    status: 200,
    description: '앨범 삭제 성공',
  })
  @ApiBearerAuth()
  @Delete('/:albumId')
  @UseGuards(AdminGuard)
  @SetMetadata('permission', 'MANAGER')
  async deleteAlbum(@Param('albumId') albumId: number) {
    return await this.galleryService.deleteAlbum(albumId);
  }
}
