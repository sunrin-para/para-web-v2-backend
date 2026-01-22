import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common'
import { PrismaService } from '@/common/prisma/prisma.service'
import { CreatePortfolioDto } from '../dto/create-portfolio.dto'
import { UpdatePortfolioDto } from '../dto/update-portfolio.dto'

@Injectable()
export class PortfolioRepository {
  constructor(private readonly prismaService: PrismaService) {}

  private buildTagRelation(tags?: string[]) {
    if (!tags || tags.length === 0) return undefined
    const uniqueTags = [...new Set(tags)]
    return {
      connectOrCreate: uniqueTags.map((tag) => ({
        where: { tagName: tag },
        create: { tagName: tag },
      })),
    }
  }

  private buildParticipantCreates(
    paraMembers?: string[],
    outsideMembers?: string[],
  ) {
    const participants: { memberName: string; isExternal: boolean }[] = []
    if (paraMembers) {
      paraMembers
        .filter((name) => name.trim().length > 0)
        .forEach((name) =>
          participants.push({ memberName: name.trim(), isExternal: false }),
        )
    }
    if (outsideMembers) {
      outsideMembers
        .filter((name) => name.trim().length > 0)
        .forEach((name) =>
          participants.push({ memberName: name.trim(), isExternal: true }),
        )
    }
    return participants
  }

  async createPortfolio(data: CreatePortfolioDto) {
    try {
      if (!data.date || data.date.length === 0) {
        throw new BadRequestException('시작 날짜가 필요합니다.')
      }
      const [startDate, endDate] = data.date
      const participants = this.buildParticipantCreates(
        data.para_member,
        data.outside_member,
      )

      return await this.prismaService.portfolio.create({
        data: {
          title: data.title,
          summary: data.summary,
          description: data.description,
          thumbnail: data.thumbnail,
          filePath: data.filePath,
          startDate,
          endDate,
          link: data.link,
          github: data.github,
          tags: this.buildTagRelation(data.tags),
          participants: participants.length
            ? { create: participants }
            : undefined,
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
            some: {
              tagName: category,
            },
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
        const [startDate, endDate] = data.date
        updateData.startDate = startDate
        updateData.endDate = endDate
      }

      if (data.tags) {
        updateData.tags = {
          set: [],
          ...this.buildTagRelation(data.tags),
        }
      }

      if (data.para_member || data.outside_member) {
        const participants = this.buildParticipantCreates(
          data.para_member,
          data.outside_member,
        )
        updateData.participants = {
          deleteMany: {},
          create: participants,
        }
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

  async deleteManyPortfoliosByIds(ids: string[]) {
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
