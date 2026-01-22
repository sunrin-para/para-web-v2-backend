import { QuestionsService } from './questions.service'

describe('QuestionsService batch', () => {
  const repository = {
    addFaq: jest.fn(),
    updateFaq: jest.fn(),
    deleteManyFaqByIds: jest.fn(),
  }
  const service = new QuestionsService(repository as any)

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns counts with failures for batch upsert', async () => {
    repository.addFaq
      .mockResolvedValueOnce(true)
      .mockRejectedValueOnce(new Error('create failed'))
    repository.updateFaq
      .mockResolvedValueOnce(true)
      .mockRejectedValueOnce(new Error('update failed'))

    const result = await service.batchUpsertFaqs(
      [
        { question: 'Q1', answer: 'A1' },
        { question: 'Q2', answer: 'A2' },
      ],
      [
        { id: 1, data: { question: 'Q3', answer: 'A3' } },
        { id: 2, data: { question: 'Q4', answer: 'A4' } },
      ],
    )

    expect(result.createdCount).toBe(1)
    expect(result.updatedCount).toBe(1)
    expect(result.failedCount).toBe(2)
    expect(result.failures).toHaveLength(2)
  })

  it('returns deleted count from repository', async () => {
    repository.deleteManyFaqByIds.mockResolvedValueOnce({ count: 5 })
    const result = await service.deleteManyFaqByIds([1, 2, 3, 4, 5])
    expect(result).toEqual({ deletedCount: 5 })
  })
})
