import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { CreatePortfolioDto } from '../dto/create-portfolio.dto';
import { UpdatePortfolioDto } from '../dto/update-portfolio.dto';
import { PortfolioDto } from '../dto/portfolio.dto';
import { MonoPortfolioList } from '../dto/portfolio-list.dto';

@Injectable()
export class PortfolioRepository {
  constructor(private readonly prismaService: PrismaService) {}
  async createPortfolio(createPortfolioDto: CreatePortfolioDto) {
    await this.prismaService.portfolio
      .create({
        data: {
          thumbnail: createPortfolioDto.thumbnail,
          filePath: createPortfolioDto.filePath,
          date:
            createPortfolioDto.date.length > 0
              ? createPortfolioDto.date.map((date) => new Date(date))
              : [],
          ...createPortfolioDto,
        },
      })
      .catch((e) => {
        throw new Error(e);
      });
    return true;
  }

  async searchPortfolioByName(keyword: string): Promise<MonoPortfolioList[]> {
    const portfolios = await this.prismaService.portfolio
      .findMany({
        where: {
          title: {
            contains: keyword,
            mode: 'insensitive',
          },
        },
      })
      .catch((e) => {
        throw new Error(e);
      });

    const miniPortfolios: Partial<MonoPortfolioList[]> = portfolios.map(
      (portfolio) => ({
        id: portfolio.id,
        title: portfolio.title,
        summary: portfolio.summary,
        tags: portfolio.tags,
        para_member: portfolio.para_member,
        thumbnail: portfolio.thumbnail,
      }),
    );

    return miniPortfolios;
  }

  async getPortfolioDetail(portfolioId: number): Promise<PortfolioDto> {
    const portfolio: PortfolioDto = await this.prismaService.portfolio
      .findFirst({
        where: { id: portfolioId },
      })
      .catch((e) => {
        throw new Error(e);
      });
    return portfolio;
  }

  async getPortfoliosByCategory(
    category: string,
  ): Promise<MonoPortfolioList[]> {
    const portfolios = await this.prismaService.portfolio
      .findMany({
        where: {
          tags: {
            has: category,
          },
        },
      })
      .catch((e) => {
        throw new Error(e);
      });

    const miniPortfolios: Partial<MonoPortfolioList[]> = portfolios.map(
      (portfolio) => ({
        id: portfolio.id,
        title: portfolio.title,
        summary: portfolio.summary,
        tags: portfolio.tags,
        para_member: portfolio.para_member,
        thumbnail: portfolio.thumbnail,
      }),
    );

    return miniPortfolios;
  }

  async getAllCategories(): Promise<string[]> {
    const portfolios = await this.prismaService.portfolio
      .findMany({
        select: {
          tags: true,
        },
      })
      .catch((e) => {
        throw new Error(e);
      });

    const allTags = [
      ...new Set(portfolios.flatMap((portfolio) => portfolio.tags)),
    ];

    return allTags;
  }

  async getPortfolioList(count: number) {
    const portfolios = await this.prismaService.portfolio
      .findMany({
        take: count,
      })
      .catch((e) => {
        throw new Error(e);
      });

    const miniPortfolios: Partial<MonoPortfolioList[]> = portfolios.map(
      (portfolio) => ({
        id: portfolio.id,
        title: portfolio.title,
        summary: portfolio.summary,
        tags: portfolio.tags,
        para_member: portfolio.para_member,
        thumbnail: portfolio.thumbnail,
      }),
    );

    return miniPortfolios;
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
