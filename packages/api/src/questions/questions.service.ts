import { Injectable } from '@nestjs/common';
import { CreateFAQDto } from './dto/register.dto';
import { QuestionsRepository } from './repository/questions.repo';
import { FAQDto } from './dto/get.dto';

@Injectable()
export class QuestionsService {
  constructor(private readonly questionsRepository: QuestionsRepository) {}
  async createFaq(createFAQDto: CreateFAQDto) {
    // 여기서 해킹구문 같은거 확인하고, 있으면 BadRequestException 발생시키기
    const newFaq = await this.questionsRepository.addFaq(createFAQDto);
    return newFaq;
  }

  async getAllFaq(): Promise<FAQDto[]> {
    const faqs: FAQDto[] = await this.questionsRepository.getAllFaq();
    return faqs;
  }

  async updateFaq(faqId: number, editFAQDto: CreateFAQDto) {
    const updatedFaq = await this.questionsRepository.updateFaq(
      faqId,
      editFAQDto,
    );
    return updatedFaq;
  }

  async deleteFaq(faqId: number) {
    const result = await this.questionsRepository.deleteFaq(faqId);
    return result;
  }
}
