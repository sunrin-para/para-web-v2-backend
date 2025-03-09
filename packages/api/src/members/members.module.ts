import { Module } from '@nestjs/common';
import { MembersService } from './members.service';
import { MembersRepository } from './repository/members.repo';
import { MembersPublicController } from './controllers/members.public.controller';
import { MembersPrivateController } from './controllers/members.private.controller';

@Module({
  controllers: [MembersPublicController, MembersPrivateController],
  providers: [MembersRepository, MembersService],
})
export class MembersModule {}
