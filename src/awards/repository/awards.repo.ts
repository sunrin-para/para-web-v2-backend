import { Injectable } from '@nestjs/common';
import { CreateAwardsDto } from '../dto/createAwards.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AwardsRepository {
  constructor(private readonly prismaService: PrismaService) {}
  async createAwardsHistory(createAwardsDto: CreateAwardsDto) {
    const newHistory = await this.prismaService.award
      .create({
        data: createAwardsDto,
      })
      .catch((e) => {
        throw new Error(e);
      });
    return newHistory;
  }

  async getAwardsHistoryByYear(year: number) {
    const awards = await this.prismaService.award
      .findMany({
        where: { year: year },
      })
      .catch((e) => {
        throw new Error(e);
      });
    return awards;
  }
}
