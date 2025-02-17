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
} from '@nestjs/common';
import { GallaryService } from './gallary.service';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { MinioService } from 'src/minio/minio.service';

@Controller('gallary')
export class GallaryController {
  constructor(
    private readonly gallaryService: GallaryService,
    private readonly minioService: MinioService,
  ) {}

  @Delete('/:albumId')
  @UseGuards(AdminGuard)
  @SetMetadata('permission', 'MANAGER')
  async deleteAlbum(@Param('albumId') albumId: number) {
    return await this.gallaryService.deleteAlbum(albumId);
  }
}
