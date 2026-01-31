import { AwardsService } from './awards.service'

describe('AwardsService batch', () => {
  const repository = {
    createAwardsHistory: jest.fn(),
    updateAwardHistory: jest.fn(),
    deleteManyAwardsByIds: jest.fn(),
  }
  const service = new AwardsService(repository as any)

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns counts with failures for batch upsert', async () => {
    repository.createAwardsHistory
      .mockResolvedValueOnce(true)
      .mockRejectedValueOnce(new Error('create failed'))
    repository.updateAwardHistory
      .mockResolvedValueOnce(true)
      .mockRejectedValueOnce(new Error('update failed'))

    const result = await service.batchUpsertAwards(
      [
        { name: 'A', member: ['a'], year: 2024 },
        { name: 'B', member: ['b'], year: 2025 },
      ],
      [
        { id: 1, data: { name: 'C', member: ['c'], year: 2022 } },
        { id: 2, data: { name: 'D', member: ['d'], year: 2023 } },
      ],
    )

    expect(result.createdCount).toBe(1)
    expect(result.updatedCount).toBe(1)
    expect(result.failedCount).toBe(2)
    expect(result.failures).toHaveLength(2)
  })

  it('returns deleted count from repository', async () => {
    repository.deleteManyAwardsByIds.mockResolvedValueOnce({ count: 3 })
    const result = await service.deleteManyAwardsByIds([1, 2, 3])
    expect(result).toEqual({ deletedCount: 3 })
  })
})
