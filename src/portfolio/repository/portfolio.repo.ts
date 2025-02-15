import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePortfolioDto } from '../dto/create-portfolio.dto';
import { UpdatePortfolioDto } from '../dto/update-portfolio.dto';

@Injectable()
export class PortfolioRepository {
  constructor(private readonly prismaService: PrismaService) {}
  async createPortfolio(createPortfolioDto: CreatePortfolioDto) {
    await this.prismaService.portfolio
      .create({
        data: {
          thumbnail: createPortfolioDto.thumbnail,
          filePath: createPortfolioDto.filePath,
          ...createPortfolioDto,
        },
      })
      .catch((e) => {
        throw new Error(e);
      });
    return true;
  }

  async updatePortfolio(
    portfolioId: number,
    updatePortfolioDto: UpdatePortfolioDto,
  ) {
    await this.prismaService.portfolio
      .update({
        where: { id: portfolioId },
        data: updatePortfolioDto,
      })
      .catch((e) => {
        throw new Error(e);
      });
    return true;
  }

  async deletePortfolio(portfolioId: number) {
    await this.prismaService.portfolio
      .delete({
        where: { id: portfolioId },
      })
      .catch((e) => {
        throw new Error(e);
      });
    return true;
  }
}
