import { Module } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { UserController } from './user.controller';
import { UserRepository } from './repository/user.repo';

@Module({
  providers: [UserRepository, PrismaService],
  controllers: [UserController],
})
export class UserModule {}
