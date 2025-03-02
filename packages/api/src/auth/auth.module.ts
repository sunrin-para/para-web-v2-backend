import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '@/common/prisma/prisma.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { TokenRepository } from './repository/token.repo';
import { UserModule } from '@/user/user.module';

@Module({
  imports: [
    forwardRef(() => UserModule),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || '293hefkjxdr@',
      signOptions: { expiresIn: '2h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    TokenRepository,
    AuthService,
    JwtStrategy,
    GoogleStrategy,
    PrismaService,
  ],
  exports: [AuthService, JwtModule, TokenRepository],
})
export class AuthModule {}
