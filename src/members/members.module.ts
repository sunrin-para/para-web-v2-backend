import { Module } from '@nestjs/common';
import { MembersService } from './members.service';
import { MembersController } from './members.controller';
import { MinioService } from 'src/minio/minio.service';
import { MembersRepository } from './repository/members.repo';
import { UserService } from 'src/user/user.service';

@Module({
  controllers: [MembersController],
  providers: [MembersRepository, MembersService, MinioService,],
})
export class MembersModule {}
