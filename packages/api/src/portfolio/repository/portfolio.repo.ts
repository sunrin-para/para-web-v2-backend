import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { PrismaService } from '@/common/prisma/prisma.service'
import { CreatePortfolioDto } from '../dto/create-portfolio.dto'
import { UpdatePortfolioDto } from '../dto/update-portfolio.dto'

@Injectable()
export class PortfolioRepository {
  constructor(private readonly prismaService: PrismaService) {}
  async createPortfolio(data: CreatePortfolioDto) {
    try {
      return await this.prismaService.portfolio.create({ data })
    }
    catch (e) {
      throw new InternalServerErrorException(e)
    }
  }

  async searchPortfolioByName(keyword: string) {
    try {
      return await this.prismaService.portfolio.findMany({
        where: {
          title: {
            contains: keyword,
            mode: 'insensitive',
          },
        },
      })
    }
    catch (e) {
      throw new InternalServerErrorException(e)
    }
  }

  async getPortfolioDetail(id: string) {
    try {
      return await this.prismaService.portfolio.findUnique({
        where: { id },
      })
    }
    catch (e) {
      throw new InternalServerErrorException(e)
    }
  }

  async getPortfoliosByCategory(category: string) {
    try {
      return await this.prismaService.portfolio.findMany({
        where: {
          tags: {
            has: category,
          },
        },
      })
    }
    catch (e) {
      throw new InternalServerErrorException(e)
    }
  }

  async getAllCategories() {
    try {
      return await this.prismaService.portfolio
        .findMany({
          select: {
            tags: true,
          },
        })
        .then((data) => {
          return [...new Set(data.flatMap(portfolio => portfolio.tags))]
        })
    }
    catch (e) {
      throw new InternalServerErrorException(e)
    }
  }

  async getPortfolioList(count: number) {
    try {
      return await this.prismaService.portfolio.findMany({
        take: count,
      })
    }
    catch (e) {
      throw new InternalServerErrorException(e)
    }
  }

  async updatePortfolio(id: string, data: UpdatePortfolioDto) {
    try {
      return await this.prismaService.portfolio.update({
        where: { id },
        data,
      })
    }
    catch (e) {
      throw new InternalServerErrorException(e)
    }
  }

  async deletePortfolio(id: string) {
    try {
      return await this.prismaService.portfolio.delete({
        where: { id },
      })
    }
    catch (e) {
      throw new InternalServerErrorException(e)
    }
  }
}
