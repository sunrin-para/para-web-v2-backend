import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MemberModule } from './member/member.module';
import { QuestionModule } from './question/question.module';
import { PortfolioModule } from './portfolio/portfolio.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [MemberModule, QuestionModule, PortfolioModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
