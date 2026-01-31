import { BadRequestException, Injectable } from '@nestjs/common'
import { MembersRepository } from './repository/members.repo'
import { UpdateMemberDto } from './dto/update-member.dto'
import { CreateMemberDto } from './dto/create-member.dto'

@Injectable()
export class MembersService {
  constructor(private readonly memberRepository: MembersRepository) {}
  async createMember(createMemberDto: CreateMemberDto) {
    return await this.memberRepository.registerMember(createMemberDto)
  }

  async getAllMembers() {
    return await this.memberRepository.getAllMembers()
  }

  async getMembersByGeneration(generation: number) {
    return await this.memberRepository.getMembersByGeneration(generation)
  }

  async getMemberDetail(memberUUID: number) {
    return await this.memberRepository.getMemberDetail(memberUUID)
  }

  async updateMemberDetail(
    memberUUID: number,
    updateMemberDto?: UpdateMemberDto,
  ) {
    if (!updateMemberDto) {
      throw new BadRequestException('수정할 값을 전송해주세요!')
    }
    return await this.memberRepository.updateMemberDetail(
      memberUUID,
      updateMemberDto,
    )
  }

  async deleteMember(memberUUID: number) {
    return await this.memberRepository.deleteMember(memberUUID)
  }

  async batchUpsertMembers(
    createItems: CreateMemberDto[],
    updateItems: { id: number; data: UpdateMemberDto }[],
  ) {
    const failures: { index: number; action: 'create' | 'update'; reason: string }[] = []
    let createdCount = 0
    let updatedCount = 0

    for (const [index, item] of createItems.entries()) {
      try {
        await this.memberRepository.registerMember(item)
        createdCount += 1
      }
      catch (error) {
        const reason = error instanceof Error ? error.message : '알 수 없는 오류'
        failures.push({ index, action: 'create', reason })
      }
    }

    for (const [index, item] of updateItems.entries()) {
      try {
        await this.memberRepository.updateMemberDetail(item.id, item.data)
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

  async deleteManyMembersByIds(ids: number[]) {
    if (ids.length === 0) {
      return { deletedCount: 0 }
    }
    const result = await this.memberRepository.deleteManyMembersByIds(ids)
    return { deletedCount: result.count }
  }
}
