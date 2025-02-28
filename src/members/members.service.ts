import { BadRequestException, Injectable } from '@nestjs/common';
import { MemberDto } from './dto/member.dto';
import { MembersRepository } from './repository/members.repo';
import { UpdateMemberDto } from './dto/update-member.dto';

@Injectable()
export class MembersService {
  constructor(private readonly memberRepository: MembersRepository) {}
  async createMember(
    createMemberDto: MemberDto,
    fileUrl: string,
  ): Promise<boolean> {
    return await this.memberRepository.registerMember(createMemberDto, fileUrl);
  }

  async getAllMembers(): Promise<MemberDto[]> {
    return await this.memberRepository.getAllMembers();
  }

  async getMembersByGeneration(generation: number): Promise<MemberDto[]> {
    if (generation < 0) {
      throw new BadRequestException('기수(Generation) 값은 0보다 커야 합니다.');
    }
    return await this.memberRepository.getMembersByGeneration(generation);
  }

  async getMemberDetail(memberId: number) {
    if (memberId < 0) {
      throw new BadRequestException('memberId 값은 0보다 커야 합니다.');
    }
    return await this.memberRepository.getMemberDetail(memberId);
  }

  async updateMemberDetail(
    memberId: number,
    updateMemberDto?: UpdateMemberDto,
    fileUrl?: string,
  ) {
    if (memberId < 0) {
      throw new BadRequestException('memberId 값은 0보다 커야 합니다.');
    }
    if (!updateMemberDto && !fileUrl) {
      throw new BadRequestException('수정할 값을 전송해주세요!');
    }
    return await this.memberRepository.updateMemberDetail(
      memberId,
      updateMemberDto,
      fileUrl,
    );
  }

  async deleteMember(memberId: number) {
    if (memberId < 0) {
      throw new BadRequestException('memberId 값은 0보다 커야 합니다.');
    }
    return await this.memberRepository.deleteMember(memberId);
  }
}
