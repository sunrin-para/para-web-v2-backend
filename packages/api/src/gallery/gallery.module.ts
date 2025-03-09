import { Module } from '@nestjs/common';
import { GalleryService } from './gallery.service';
import { GalleryController } from './gallery.controller';
import { GalleryRepository } from './repository/gallery.repo';
import { MinioService } from '@/minio/minio.service';

@Module({
  controllers: [GalleryController],
  providers: [GalleryRepository, GalleryService, MinioService],
})
export class GalleryModule {}
