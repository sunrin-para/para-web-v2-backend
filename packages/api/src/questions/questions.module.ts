import { Module } from '@nestjs/common'
import { QuestionsService } from './questions.service'
import { QuestionsController } from './questions.controller'
import { QuestionsRepository } from './repository/questions.repo'

@Module({
  controllers: [QuestionsController],
  providers: [QuestionsRepository, QuestionsService],
})
export class QuestionsModule {}
