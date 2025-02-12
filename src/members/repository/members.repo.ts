import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MemberDto } from '../dto/member.dto';
import { UpdateMemberDto } from '../dto/update-member.dto';

@Injectable()
export class MembersRepository {
  constructor(private readonly prismaService: PrismaService) {}
  async registerMember(createMemberDto: MemberDto, fileUrl: string) {
    await this.prismaService.member
      .create({
        data: { ...createMemberDto, profile_image: fileUrl },
      })
      .catch((e) => {
        throw new Error(e);
      });
    return true;
  }

  async getAllMembers(): Promise<MemberDto[]> {
    const members = await this.prismaService.member.findMany().catch((e) => {
      throw new Error(e);
    });
    return members;
  }

  async getMembersByGeneration(generation: number): Promise<MemberDto[]> {
    const members = await this.prismaService.member
      .findMany({
        where: { generation: generation },
      })
      .catch((e) => {
        throw new Error(e);
      });
    return members;
  }

  async getMemberDetail(memberId: number): Promise<MemberDto> {
    const memberDetail = await this.prismaService.member
      .findFirst({
        where: { id: memberId },
      })
      .catch((e) => {
        throw new Error(e);
      });

    return memberDetail;
  }

  async deleteMember(memberId: number) {
    await this.prismaService.member
      .delete({
        where: { id: memberId },
      })
      .catch((e) => {
        throw new Error(e);
      });
    return true;
  }

  async updateMemberDetail(
    memberId: number,
    updateMemberDto?: UpdateMemberDto,
    fileUrl?: string,
  ) {
    const updateData: Partial<UpdateMemberDto> = {};

    Object.keys(updateMemberDto).forEach((key) => {
      if (updateMemberDto[key] !== undefined) {
        updateData[key] = updateMemberDto[key];
      }
    });

    if (fileUrl) {
      updateData.profile_image = fileUrl;
    }

    const updatedMember = await this.prismaService.member
      .update({
        where: { id: memberId },
        data: updateData,
      })
      .catch((e) => {
        throw new Error(e);
      });

    return updatedMember;
  }
}
