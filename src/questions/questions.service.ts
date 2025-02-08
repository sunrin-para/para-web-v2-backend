import { Injectable } from '@nestjs/common';
import { CreateFAQDto } from './dto/register.dto';
import { QuestionsRepository } from './repository/questions.repo';
import { EditFAQDto } from './dto/edit.dto';
import { DeleteFAQDto } from './dto/delete.dto';
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

  async updateFaq(editFAQDto: EditFAQDto) {
    const updatedFaq = await this.questionsRepository.updateFaq(editFAQDto);
    return updatedFaq;
  }

  async deleteFaq(deleteFAQDto: DeleteFAQDto) {
    const result = await this.questionsRepository.deleteFaq(deleteFAQDto.id);
    return result;
  }
}
