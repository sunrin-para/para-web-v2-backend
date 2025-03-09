import { Module } from '@nestjs/common';
import { GalleryService } from './gallery.service';
import { GalleryRepository } from './repository/gallery.repo';
import { GalleryPrivateController } from './controllers/gallery.private.controller';
import { GalleryPublicController } from './controllers/gallery.public.controller';

@Module({
  controllers: [GalleryPublicController, GalleryPrivateController],
  providers: [GalleryRepository, GalleryService],
})
export class GalleryModule {}
