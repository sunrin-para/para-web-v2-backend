import { Module } from '@nestjs/common';
import { ApplyService } from './apply.service';
import { ApplyController } from './apply.controller';
import { ApplyRepository } from './repository/apply.repo';
import { UserService } from 'src/user/user.service';
import { MinioService } from 'src/minio/minio.service';

@Module({
  controllers: [ApplyController],
  providers: [ApplyService, ApplyRepository, UserService, MinioService],
})
export class ApplyModule {}
