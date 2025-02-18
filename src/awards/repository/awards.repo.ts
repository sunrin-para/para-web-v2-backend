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
        where: { year: parseInt(`${year}`) },
      })
      .catch((e) => {
        throw new Error(e);
      });
    return awards;
  }

  async updateAwardHistory(id: number, updateAwardDto: CreateAwardsDto) {
    const award = await this.prismaService.award
      .update({
        where: { id: parseInt(`${id}`) },
        data: {
          name: updateAwardDto.name,
          member: updateAwardDto.member,
          year: updateAwardDto.year,
        },
      })
      .catch((e) => {
        throw new Error(e);
      });
    return award;
  }

  async deleteAwardById(id: number) {
    await this.prismaService.award
      .delete({
        where: { id: parseInt(`${id}`) },
      })
      .catch((e) => {
        throw new Error(e);
      });
    return true;
  }

  async deleteManyAwardsByYear(year: number) {
    await this.prismaService.award
      .deleteMany({
        where: { year: parseInt(`${year}`) },
      })
      .catch((e) => {
        throw new Error(e);
      });
    return true;
  }
}
