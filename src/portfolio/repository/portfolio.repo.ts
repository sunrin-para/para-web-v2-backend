import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePortfolioDto } from '../dto/create-portfolio.dto';

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
}
