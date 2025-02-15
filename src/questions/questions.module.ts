import { Module } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';
import { QuestionsRepository } from './repository/questions.repo';
import { UserService } from 'src/user/user.service';

@Module({
  controllers: [QuestionsController],
  providers: [QuestionsRepository, QuestionsService, UserService],
})
export class QuestionsModule {}
