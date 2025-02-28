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
import { GallaryService } from './gallary.service';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { MinioService } from 'src/minio/minio.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FileType } from 'src/common/enums/FileType.enum';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('gallary')
export class GallaryController {
  constructor(
    private readonly gallaryService: GallaryService,
    private readonly minioService: MinioService,
  ) {}

  @ApiBearerAuth()
  @Post()
  @UseGuards(AdminGuard)
  @SetMetadata('permission', 'MANAGER')
  @UseInterceptors(FilesInterceptor('files'))
  async createAlbum(
    @Body() createAlbumDto: CreateAlbumDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const filesUrlList: string[] = [];
    for (const file of files) {
      const fileUrl = await this.minioService.uploadFile(
        new File([file.buffer], file.originalname),
        this.minioService.generateFilename(file.originalname),
        FileType.GALLARY,
      );
      filesUrlList.push(fileUrl);
    }
    return await this.gallaryService.createAlbum(createAlbumDto, filesUrlList);
  }

  @Get('/detail/:albumId')
  async getAlbumDetail(@Param('albumId') albumId: number) {
    return await this.gallaryService.getAlbumDetail(albumId);
  }

  @Get()
  async getAllAlbums() {
    return await this.gallaryService.getAllAlbums();
  }

  @Get('/year/:year')
  async getAlbumsByYear(@Param('year') year: number) {
    const albums = await this.gallaryService.getAlbumsByYear(year);
    return {
      year,
      albums: albums.map((album) => ({
        title: album.title,
        date: album.date,
        thumbnailUrl: album.photos[0], // 첫 번째 사진을 썸네일로 사용
      })),
    };
  }

  @ApiBearerAuth()
  @Patch('/:albumId')
  @UseGuards(AdminGuard)
  @SetMetadata('permission', 'MANAGER')
  @UseInterceptors(FilesInterceptor('files'))
  async updateAlbum(
    @Param('albumId') albumId: number,
    @Body() updateAlbumDto: UpdateAlbumDto,
    @UploadedFiles() files?: Array<Express.Multer.File>,
  ) {
    const newPhotosUrls: string[] = [];

    if (files && files.length > 0) {
      for (const file of files) {
        const fileUrl = await this.minioService.uploadFile(
          new File([file.buffer], file.originalname),
          this.minioService.generateFilename(file.originalname),
          FileType.GALLARY,
        );
        newPhotosUrls.push(fileUrl);
      }
    }

    return await this.gallaryService.updateAlbum(
      albumId,
      updateAlbumDto,
      newPhotosUrls,
    );
  }

  @ApiBearerAuth()
  @Delete('/:albumId')
  @UseGuards(AdminGuard)
  @SetMetadata('permission', 'MANAGER')
  async deleteAlbum(@Param('albumId') albumId: number) {
    return await this.gallaryService.deleteAlbum(albumId);
  }
}
