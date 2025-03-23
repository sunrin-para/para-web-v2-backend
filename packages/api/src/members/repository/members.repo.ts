import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { MemberDto } from '../dto/member.dto';
import { UpdateMemberDto } from '../dto/update-member.dto';
import { CreateMemberDto } from '../dto/create-member.dto';

@Injectable()
export class MembersRepository {
  constructor(private readonly prismaService: PrismaService) {}
  async registerMember(data: CreateMemberDto) {
    try {
      return await this.prismaService.member.create({ data });
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async getAllMembers() {
    try {
      return await this.prismaService.member.findMany();
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async getMembersByGeneration(generation: number) {
    try {
      return await this.prismaService.member.findMany({
        where: { generation },
      });
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async getMemberDetail(id: string) {
    try {
      return await this.prismaService.member.findUnique({
        where: { id },
      });
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async updateMemberDetail(id: string, data?: UpdateMemberDto) {
    try {
      return await this.prismaService.member.update({
        where: { id },
        data,
      });
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async deleteMember(id: string) {
    try {
      return await this.prismaService.member.delete({
        where: { id },
      });
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
