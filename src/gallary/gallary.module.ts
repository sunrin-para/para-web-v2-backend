import { Module } from '@nestjs/common';
import { GallaryService } from './gallary.service';
import { GallaryController } from './gallary.controller';
import { GallaryRepository } from './repository/gallary.repo';
import { UserService } from 'src/user/user.service';

@Module({
  controllers: [GallaryController],
  providers: [GallaryRepository, GallaryService, UserService],
})
export class GallaryModule {}
