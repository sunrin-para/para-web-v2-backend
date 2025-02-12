import { Module } from '@nestjs/common';
import { GallaryService } from './gallary.service';
import { GallaryController } from './gallary.controller';
import { GallaryRepository } from './repository/gallary.repo';
import { MinioService } from 'src/minio/minio.service';

@Module({
  controllers: [GallaryController],
  providers: [GallaryRepository, GallaryService, MinioService],
})
export class GallaryModule {}
