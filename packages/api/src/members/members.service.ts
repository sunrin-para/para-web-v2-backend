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

  async getMemberDetail(memberUUID: string) {
    return await this.memberRepository.getMemberDetail(memberUUID)
  }

  async updateMemberDetail(
    memberUUID: string,
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

  async deleteMember(memberUUID: string) {
    return await this.memberRepository.deleteMember(memberUUID)
  }
}
