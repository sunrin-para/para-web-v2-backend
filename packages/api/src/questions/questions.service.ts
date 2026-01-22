import { Injectable } from '@nestjs/common'
import { CreateFAQDto } from './dto/register.dto'
import { QuestionsRepository } from './repository/questions.repo'

@Injectable()
export class QuestionsService {
  constructor(private readonly questionsRepository: QuestionsRepository) {}
  async createFaq(createFAQDto: CreateFAQDto) {
    return await this.questionsRepository.addFaq(createFAQDto)
  }

  async getAllFaq() {
    return await this.questionsRepository.getAllFaq()
  }

  async updateFaq(faqId: number, editFAQDto: CreateFAQDto) {
    return await this.questionsRepository.updateFaq(faqId, editFAQDto)
  }

  async deleteFaq(faqId: number) {
    return await this.questionsRepository.deleteFaq(faqId)
  }

  async batchUpsertFaqs(
    createItems: CreateFAQDto[],
    updateItems: { id: number; data: CreateFAQDto }[],
  ) {
    const failures: { index: number; action: 'create' | 'update'; reason: string }[] = []
    let createdCount = 0
    let updatedCount = 0

    for (const [index, item] of createItems.entries()) {
      try {
        await this.questionsRepository.addFaq(item)
        createdCount += 1
      }
      catch (error) {
        const reason = error instanceof Error ? error.message : '알 수 없는 오류'
        failures.push({ index, action: 'create', reason })
      }
    }

    for (const [index, item] of updateItems.entries()) {
      try {
        await this.questionsRepository.updateFaq(item.id, item.data)
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

  async deleteManyFaqByIds(ids: number[]) {
    if (ids.length === 0) {
      return { deletedCount: 0 }
    }
    const result = await this.questionsRepository.deleteManyFaqByIds(ids)
    return { deletedCount: result.count }
  }
}
