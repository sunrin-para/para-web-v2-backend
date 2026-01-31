import { BadRequestException, Injectable } from '@nestjs/common'
import { PortfolioRepository } from './repository/portfolio.repo'
import { CreatePortfolioDto } from './dto/create-portfolio.dto'
import { UpdatePortfolioDto } from './dto/update-portfolio.dto'

@Injectable()
export class PortfolioService {
  constructor(private readonly portfolioRepository: PortfolioRepository) {}

  async createPortfolio(createPortfolioDto: CreatePortfolioDto) {
    await this.portfolioRepository.createPortfolio(createPortfolioDto)
  }

  async searchPortfolioByName(keyword: string) {
    return await this.portfolioRepository.searchPortfolioByName(keyword)
  }

  async getPortfolioDetail(portfolioUUID: number) {
    return await this.portfolioRepository.getPortfolioDetail(portfolioUUID)
  }

  async getPortfoliosByCategory(category: string) {
    return await this.portfolioRepository.getPortfoliosByCategory(category)
  }

  async getPortfolioList(count: number = 50) {
    return await this.portfolioRepository.getPortfolioList(count)
  }

  async getTagsList() {
    return await this.portfolioRepository.getAllCategories()
  }

  async updatePortfolio(
    portfolioUUID: number,
    updatePortfolioDto?: Partial<UpdatePortfolioDto>,
  ) {
    if (!updatePortfolioDto) {
      throw new BadRequestException('수정할 정보가 제공되지 않았습니다.')
    }
    return await this.portfolioRepository.updatePortfolio(
      portfolioUUID,
      updatePortfolioDto,
    )
  }

  async deletePortfolio(portfolioUUID: number) {
    return await this.portfolioRepository.deletePortfolio(portfolioUUID)
  }

  async batchUpsertPortfolios(
    createItems: CreatePortfolioDto[],
    updateItems: { id: number; data: UpdatePortfolioDto }[],
  ) {
    const failures: { index: number; action: 'create' | 'update'; reason: string }[] = []
    let createdCount = 0
    let updatedCount = 0

    for (const [index, item] of createItems.entries()) {
      try {
        await this.portfolioRepository.createPortfolio(item)
        createdCount += 1
      }
      catch (error) {
        const reason = error instanceof Error ? error.message : '알 수 없는 오류'
        failures.push({ index, action: 'create', reason })
      }
    }

    for (const [index, item] of updateItems.entries()) {
      try {
        await this.portfolioRepository.updatePortfolio(item.id, item.data)
        updatedCount += 1
      }
      catch (error) {
        const reason = error instanceof Error ? error.message : '알 수 없는 오류'
        failures.push({ index, action: 'update', reason })
      }
    }

    return {
      createdCount,
      updatedCount,
      failedCount: failures.length,
      failures,
    }
  }

  async deleteManyPortfoliosByIds(ids: number[]) {
    if (ids.length === 0) {
      return { deletedCount: 0 }
    }
    const result = await this.portfolioRepository.deleteManyPortfoliosByIds(ids)
    return { deletedCount: result.count }
  }
}
