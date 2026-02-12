import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common'
import { PrismaService } from '@/common/prisma/prisma.service'
import { CreatePortfolioDto } from '../dto/create-portfolio.dto'
import { UpdatePortfolioDto } from '../dto/update-portfolio.dto'
import { SortType } from '@/common/enums/SortType.enum'

@Injectable()
export class PortfolioRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createPortfolio(data: CreatePortfolioDto) {
    try {
      if (!data.date || data.date.length === 0) {
        throw new BadRequestException('시작 날짜가 필요합니다.')
      }
      return await this.prismaService.portfolio.create({
        data: {
          title: data.title,
          summary: data.summary,
          description: data.description,
          thumbnail: data.thumbnail,
          filePath: data.filePath,
          date: data.date,
          link: data.link,
          github: data.github,
          tags: data.tags,
          para_member: data.para_member,
          outside_member: data.outside_member,
        },
      })
    }
    catch (e) {
      if (e instanceof BadRequestException) {
        throw e
      }
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
      if (e instanceof BadRequestException) {
        throw e
      }
      throw new InternalServerErrorException(e)
    }
  }

  async getPortfolioDetail(id: number) {
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

  async getPortfolioList(sort: SortType, count: number) {
    try {
      return await this.prismaService.portfolio.findMany({
        take: count,
        orderBy: {
          date: sort === SortType.NEWEST ? 'desc' : sort === SortType.LATEST ? 'asc' : sort === SortType.OLDEST ? 'asc' : 'desc',
        },
      })
    }
    catch (e) {
      throw new InternalServerErrorException(e)
    }
  }

  async updatePortfolio(id: number, data: UpdatePortfolioDto) {
    try {
      const updateData: Record<string, unknown> = {
        title: data.title,
        summary: data.summary,
        description: data.description,
        thumbnail: data.thumbnail,
        filePath: data.filePath,
        link: data.link,
        github: data.github,
      }

      if (data.date && data.date.length > 0) {
        updateData.date = data.date
      }

      if (data.tags !== undefined) {
        updateData.tags = data.tags
      }

      if (data.para_member !== undefined) {
        updateData.para_member = data.para_member
      }
      if (data.outside_member !== undefined) {
        updateData.outside_member = data.outside_member
      }

      return await this.prismaService.portfolio.update({
        where: { id },
        data: updateData,
      })
    }
    catch (e) {
      throw new InternalServerErrorException(e)
    }
  }

  async deletePortfolio(id: number) {
    try {
      return await this.prismaService.portfolio.delete({
        where: { id },
      })
    }
    catch (e) {
      throw new InternalServerErrorException(e)
    }
  }

  async deleteManyPortfoliosByIds(ids: number[]) {
    try {
      return await this.prismaService.portfolio.deleteMany({
        where: { id: { in: ids } },
      })
    }
    catch (e) {
      throw new InternalServerErrorException(e)
    }
  }
}
