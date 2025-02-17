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
import { AdminGuard } from 'src/common/guards/admin.guard';
import { MinioService } from 'src/minio/minio.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FileType } from 'src/multer.config';
import { UpdateAlbumDto } from './dto/update-album.dto';

@Controller('gallary')
export class GallaryController {
  constructor(
    private readonly gallaryService: GallaryService,
    private readonly minioService: MinioService,
  ) {}

  @Post()
  @UseGuards(AdminGuard)
  @SetMetadata('permission', 'MANAGER')
  @UseInterceptors(FilesInterceptor('files'))
  async createAlbum(
    @Body() createAlbumDto: CreateAlbumDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    let filesUrlList: string[] = [];
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

  @Patch('/:albumId')
  @UseGuards(AdminGuard)
  @SetMetadata('permission', 'MANAGER')
  @UseInterceptors(FilesInterceptor('files'))
  async updateAlbum(
    @Param('albumId') albumId: number,
    @Body() updateAlbumDto: UpdateAlbumDto,
    @UploadedFiles() files?: Array<Express.Multer.File>,
  ) {
    let newPhotosUrls: string[] = [];

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

  @Delete('/:albumId')
  @UseGuards(AdminGuard)
  @SetMetadata('permission', 'MANAGER')
  async deleteAlbum(@Param('albumId') albumId: number) {
    return await this.gallaryService.deleteAlbum(albumId);
  }
}
