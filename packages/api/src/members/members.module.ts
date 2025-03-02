import { Module } from '@nestjs/common';
import { MembersService } from './members.service';
import { MembersController } from './members.controller';
import { MinioService } from '@/minio/minio.service';
import { MembersRepository } from './repository/members.repo';

@Module({
  controllers: [MembersController],
  providers: [MembersRepository, MembersService, MinioService,],
})
export class MembersModule {}
