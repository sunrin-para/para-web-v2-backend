import { Injectable } from '@nestjs/common';
import { CreateFAQDto } from '../dto/register.dto';
import { PrismaService } from '@/common/prisma/prisma.service';
import { FAQDto } from '../dto/get.dto';

@Injectable()
export class QuestionsRepository {
  constructor(private readonly prismaService: PrismaService) {}
  async addFaq(createFAQDto: CreateFAQDto) {
    const newFaq = await this.prismaService.faq
      .create({
        data: {
          question: createFAQDto.question,
          answer: createFAQDto.answer,
        },
      })
      .catch((e) => {
        throw new Error(e);
      });

    return newFaq;
  }

  async getAllFaq(): Promise<FAQDto[]> {
    const Faqs: FAQDto[] = await this.prismaService.faq.findMany();
    return Faqs;
  }

  async updateFaq(faqId: number, editFAQDto: CreateFAQDto) {
    const updatedFaq = await this.prismaService.faq
      .update({
        where: { id: parseInt(`${faqId}`) },
        // 수정한 데이터만 잘 반영되는지 확인.
        data: { question: editFAQDto.question, answer: editFAQDto.answer },
      })
      .catch((e) => {
        throw new Error(e);
      });

    return updatedFaq;
  }

  async deleteFaq(faqId: number) {
    await this.prismaService.faq
      .delete({
        where: { id: parseInt(`${faqId}`) },
      })
      .catch((e) => {
        throw new Error(e);
      });
    return true;
  }
}
