import { MembersService } from './members.service'

describe('MembersService batch', () => {
  const repository = {
    registerMember: jest.fn(),
    updateMemberDetail: jest.fn(),
    deleteManyMembersByIds: jest.fn(),
  }
  const service = new MembersService(repository as any)

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns counts with failures for batch upsert', async () => {
    repository.registerMember
      .mockResolvedValueOnce(true)
      .mockRejectedValueOnce(new Error('create failed'))
    repository.updateMemberDetail
      .mockResolvedValueOnce(true)
      .mockRejectedValueOnce(new Error('update failed'))

    const result = await service.batchUpsertMembers(
      [
        {
          generation: 1,
          name: 'A',
          department: 'S',
          speciality: 'B',
          introduction: 'intro',
          profile_image: 'url',
        },
        {
          generation: 2,
          name: 'B',
          department: 'S',
          speciality: 'B',
          introduction: 'intro',
          profile_image: 'url',
        },
      ],
      [
        { id: '1', data: { name: 'C' } },
        { id: '2', data: { name: 'D' } },
      ],
    )

    expect(result.createdCount).toBe(1)
    expect(result.updatedCount).toBe(1)
    expect(result.failedCount).toBe(2)
    expect(result.failures).toHaveLength(2)
  })

  it('returns deleted count from repository', async () => {
    repository.deleteManyMembersByIds.mockResolvedValueOnce({ count: 2 })
    const result = await service.deleteManyMembersByIds(['1', '2'])
    expect(result).toEqual({ deletedCount: 2 })
  })
})
