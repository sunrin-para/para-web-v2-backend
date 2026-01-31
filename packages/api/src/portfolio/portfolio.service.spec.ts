import { PortfolioService } from './portfolio.service'

describe('PortfolioService batch', () => {
  const repository = {
    createPortfolio: jest.fn(),
    updatePortfolio: jest.fn(),
    deleteManyPortfoliosByIds: jest.fn(),
  }
  const service = new PortfolioService(repository as any)

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns counts with failures for batch upsert', async () => {
    repository.createPortfolio
      .mockResolvedValueOnce(true)
      .mockRejectedValueOnce(new Error('create failed'))
    repository.updatePortfolio
      .mockResolvedValueOnce(true)
      .mockRejectedValueOnce(new Error('update failed'))

    const result = await service.batchUpsertPortfolios(
      [
        {
          title: 'A',
          summary: 'S',
          description: 'D',
          tags: ['t'],
          para_member: ['m'],
          outside_member: ['o'],
          date: [new Date(), new Date()],
          link: 'link',
          github: 'git',
          thumbnail: 'thumb',
          filePath: 'file',
        },
        {
          title: 'B',
          summary: 'S',
          description: 'D',
          tags: ['t'],
          para_member: ['m'],
          outside_member: ['o'],
          date: [new Date(), new Date()],
          link: 'link',
          github: 'git',
          thumbnail: 'thumb',
          filePath: 'file',
        },
      ],
      [
        { id: 1, data: { title: 'C' } },
        { id: 2, data: { title: 'D' } },
      ],
    )

    expect(result.createdCount).toBe(1)
    expect(result.updatedCount).toBe(1)
    expect(result.failedCount).toBe(2)
    expect(result.failures).toHaveLength(2)
  })

  it('returns deleted count from repository', async () => {
    repository.deleteManyPortfoliosByIds.mockResolvedValueOnce({ count: 4 })
    const result = await service.deleteManyPortfoliosByIds([1, 2, 3, 4])
    expect(result).toEqual({ deletedCount: 4 })
  })
})
