import { Module } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { UserController } from './user.controller';
import { UserRepository } from './repository/user.repo';
import { AuthService } from 'src/auth/auth.service';

@Module({
  providers: [UserRepository, PrismaService, AuthService],
  controllers: [UserController],
})
export class UserModule {}
