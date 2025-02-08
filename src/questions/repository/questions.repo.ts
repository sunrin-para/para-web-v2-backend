import { Injectable } from '@nestjs/common';
import { CreateFAQDto } from '../dto/register.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { EditFAQDto } from '../dto/edit.dto';
import { DeleteFAQDto } from '../dto/delete.dto';
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

  async updateFaq(editFAQDto: EditFAQDto) {
    const updatedFaq = await this.prismaService.faq
      .update({
        where: { id: editFAQDto.id },
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
        where: { id: faqId },
      })
      .catch((e) => {
        throw new Error(e);
      });
    return true;
  }
}
