import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { CreateFAQDto } from '../dto/register.dto'
import { PrismaService } from '@/common/prisma/prisma.service'

@Injectable()
export class QuestionsRepository {
  constructor(private readonly prismaService: PrismaService) {}
  async addFaq(data: CreateFAQDto) {
    try {
      return await this.prismaService.faq.create({ data })
    }
    catch {
      throw new InternalServerErrorException()
    }
  }

  async getAllFaq() {
    try {
      return await this.prismaService.faq.findMany()
    }
    catch {
      throw new InternalServerErrorException()
    }
  }

  async updateFaq(id: number, data: CreateFAQDto) {
    try {
      return await this.prismaService.faq.update({
        where: { id },
        data,
      })
    }
    catch {
      throw new InternalServerErrorException()
    }
  }

  async deleteFaq(id: number) {
    try {
      return await this.prismaService.faq.delete({
        where: { id },
      })
    }
    catch {
      throw new InternalServerErrorException()
    }
  }

  async deleteManyFaqByIds(ids: number[]) {
    try {
      return await this.prismaService.faq.deleteMany({
        where: { id: { in: ids } },
      })
    }
    catch {
      throw new InternalServerErrorException()
    }
  }
}
