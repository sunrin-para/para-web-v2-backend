import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateAwardsDto } from '../dto/createAwards.dto';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class AwardsRepository {
  constructor(private readonly prismaService: PrismaService) {}
  async createAwardsHistory(data: CreateAwardsDto) {
    try {
      return await this.prismaService.award.create({ data });
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async getAwardsHistoryByYear(year: number) {
    try {
      return await this.prismaService.award.findMany({
        where: { year },
      });
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async updateAwardHistory(id: number, data: CreateAwardsDto) {
    try {
      return await this.prismaService.award.update({
        where: { id },
        data,
      });
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async deleteAwardById(id: number) {
    try {
      return await this.prismaService.award.delete({
        where: { id },
      });
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async deleteManyAwardsByYear(year: number) {
    try {
      return await this.prismaService.award.deleteMany({
        where: { year },
      });
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
