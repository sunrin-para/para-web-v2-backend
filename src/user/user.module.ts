import { forwardRef, Global, Module } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { UserController } from './user.controller';
import { UserRepository } from './repository/user.repo';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';

@Global()
@Module({
  imports: [forwardRef(() => AuthModule)],
  providers: [
    UserRepository,
    UserService,
    ConfigService,
    // PrismaService,
    AuthService,
  ],
  controllers: [UserController],
  exports: [UserService, UserRepository, ConfigService],
})
export class UserModule {}
