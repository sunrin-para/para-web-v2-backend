import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { QuestionsModule } from './questions/questions.module';
import { AwardsModule } from './awards/awards.module';
import { MembersModule } from './members/members.module';
import { MinioModule } from './minio/minio.module';
import { GallaryModule } from './gallary/gallary.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    UserModule,
    QuestionsModule,
    AwardsModule,
    MembersModule,
    MinioModule,
    GallaryModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, UserService],
})
export class AppModule {}
