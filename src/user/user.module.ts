import { Global, Module } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { UserController } from './user.controller';
import { UserRepository } from './repository/user.repo';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  providers: [
    UserRepository,
    UserService,
    ConfigService
    // PrismaService,
    // AuthService
  ],
  controllers: [UserController],
  exports: [UserService, UserRepository, ConfigService],
})
export class UserModule {}
