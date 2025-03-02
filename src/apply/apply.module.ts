import { Module } from '@nestjs/common';
import { ApplyService } from './apply.service';
import { ApplyRepository } from './repository/apply.repo';
import { MinioService } from 'src/minio/minio.service';
import { ApplyPublicController } from './controllers/apply.public.controller';
import { ApplyPrivateController } from './controllers/apply.private.controller';

@Module({
  controllers: [ApplyPublicController, ApplyPrivateController],
  providers: [ApplyService, ApplyRepository, MinioService],
})
export class ApplyModule {}
