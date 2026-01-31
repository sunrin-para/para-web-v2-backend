import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { PrismaService } from '@/common/prisma/prisma.service'
import { UpdateMemberDto } from '../dto/update-member.dto'
import { CreateMemberDto } from '../dto/create-member.dto'

@Injectable()
export class MembersRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async registerMember(data: CreateMemberDto) {
    try {
      return await this.prismaService.member.create({
        data: {
          generation: data.generation,
          name: data.name,
          introduction: data.introduction,
          profile_image: data.profile_image,
          department: data.department,
          speciality: data.speciality,
          discord: data.discord,
          github: data.github,
          instagram: data.instagram,
          solvedac: data.solvedac,
          email: data.email,
        },
      })
    }
    catch (e) {
      throw new InternalServerErrorException(e)
    }
  }

  async getAllMembers() {
    try {
      return await this.prismaService.member.findMany()
    }
    catch (e) {
      throw new InternalServerErrorException(e)
    }
  }

  async getMembersByGeneration(generation: number) {
    try {
      return await this.prismaService.member.findMany({
        where: { generation },
      })
    }
    catch (e) {
      throw new InternalServerErrorException(e)
    }
  }

  async getMemberDetail(id: number) {
    try {
      return await this.prismaService.member.findUnique({
        where: { id },
      })
    }
    catch (e) {
      throw new InternalServerErrorException(e)
    }
  }

  async updateMemberDetail(id: number, data?: UpdateMemberDto) {
    try {
      const updateData: Record<string, unknown> = {}
      if (data?.generation !== undefined) updateData.generation = data.generation
      if (data?.name !== undefined) updateData.name = data.name
      if (data?.introduction !== undefined) updateData.introduction = data.introduction
      if (data?.profile_image !== undefined) updateData.profile_image = data.profile_image
      if (data?.department !== undefined) updateData.department = data.department
      if (data?.speciality !== undefined) updateData.speciality = data.speciality
      if (data?.discord !== undefined) updateData.discord = data.discord
      if (data?.github !== undefined) updateData.github = data.github
      if (data?.instagram !== undefined) updateData.instagram = data.instagram
      if (data?.solvedac !== undefined) updateData.solvedac = data.solvedac
      if (data?.email !== undefined) updateData.email = data.email

      return await this.prismaService.member.update({
        where: { id },
        data: updateData,
      })
    }
    catch (e) {
      throw new InternalServerErrorException(e)
    }
  }

  async deleteMember(id: number) {
    try {
      return await this.prismaService.member.delete({
        where: { id },
      })
    }
    catch (e) {
      throw new InternalServerErrorException(e)
    }
  }

  async deleteManyMembersByIds(ids: number[]) {
    try {
      return await this.prismaService.member.deleteMany({
        where: { id: { in: ids } },
      })
    }
    catch (e) {
      throw new InternalServerErrorException(e)
    }
  }
}
