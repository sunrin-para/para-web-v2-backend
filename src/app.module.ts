import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MemberService } from './member/member.service';
import { MemberModule } from './member/member.module';
import { AuthModule } from './auth/auth.module';
import { QuestionModule } from './question/question.module';
import { PortfolioModule } from './portfolio/portfolio.module';

@Module({
  imports: [MemberModule, AuthModule, QuestionModule, PortfolioModule],
  controllers: [AppController],
  providers: [AppService, MemberService],
})
export class AppModule {}
