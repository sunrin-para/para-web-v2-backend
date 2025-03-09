import { Injectable } from '@nestjs/common';
import { CreateFAQDto } from './dto/register.dto';
import { QuestionsRepository } from './repository/questions.repo';

@Injectable()
export class QuestionsService {
  constructor(private readonly questionsRepository: QuestionsRepository) {}
  async createFaq(createFAQDto: CreateFAQDto) {
    return await this.questionsRepository.addFaq(createFAQDto);
  }

  async getAllFaq() {
    return await this.questionsRepository.getAllFaq();
  }

  async updateFaq(faqId: number, editFAQDto: CreateFAQDto) {
    return await this.questionsRepository.updateFaq(faqId, editFAQDto);
  }

  async deleteFaq(faqId: number) {
    return await this.questionsRepository.deleteFaq(faqId);
  }
}
