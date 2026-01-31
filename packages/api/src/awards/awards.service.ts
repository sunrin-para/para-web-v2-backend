import { Injectable } from '@nestjs/common'
import { AwardsRepository } from './repository/awards.repo'
import { CreateAwardsDto } from './dto/createAwards.dto'

@Injectable()
export class AwardsService {
  constructor(private readonly awardsRepository: AwardsRepository) {}

  async createAwardsHistory(createAwardsDto: CreateAwardsDto) {
    return await this.awardsRepository.createAwardsHistory(createAwardsDto)
  }

  async getAllAwards() {
    return await this.awardsRepository.getAllAwards()
  }

  async getAwardsHistoryByYear(year: number) {
    return await this.awardsRepository.getAwardsHistoryByYear(year)
  }

  async searchAwardsByKeyword(keyword: string) {
    return await this.awardsRepository.searchAwardsByKeyword(keyword)
  }

  async updateAwardsHistory(
    awardUUID: number,
    updateAwardDto: CreateAwardsDto,
  ) {
    return await this.awardsRepository.updateAwardHistory(
      awardUUID,
      updateAwardDto,
    )
  }

  async deleteAwardById(uuid: number) {
    return await this.awardsRepository.deleteAwardById(uuid)
  }

  async deleteManyAwardsByYear(year: number) {
    return await this.awardsRepository.deleteManyAwardsByYear(year)
  }

  async batchUpsertAwards(
    createItems: CreateAwardsDto[],
    updateItems: { id: number; data: CreateAwardsDto }[],
  ) {
    const failures: { index: number; action: 'create' | 'update'; reason: string }[] = []
    let createdCount = 0
    let updatedCount = 0

    for (const [index, item] of createItems.entries()) {
      try {
        await this.awardsRepository.createAwardsHistory(item)
        createdCount += 1
      }
      catch (error) {
        const reason = error instanceof Error ? error.message : '알 수 없는 오류'
        failures.push({ index, action: 'create', reason })
      }
    }

    for (const [index, item] of updateItems.entries()) {
      try {
        await this.awardsRepository.updateAwardHistory(item.id, item.data)
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

  async deleteManyAwardsByIds(ids: number[]) {
    if (ids.length === 0) {
      return { deletedCount: 0 }
    }
    const result = await this.awardsRepository.deleteManyAwardsByIds(ids)
    return { deletedCount: result.count }
  }
}
