import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common'
import { PrismaService } from '@/common/prisma/prisma.service'
import { UpdateMemberDto } from '../dto/update-member.dto'
import { CreateMemberDto } from '../dto/create-member.dto'
import { Department } from '@sunrin-para/database'

@Injectable()
export class MembersRepository {
  constructor(private readonly prismaService: PrismaService) {}

  private resolveDepartment(value: string): Department {
    const normalized = value.trim().toLowerCase()
    if (normalized === '정보보호과' || normalized === 'infosec') {
      return Department.INFOSEC
    }
    if (normalized === '소프트웨어과' || normalized === 'software') {
      return Department.SOFTWARE
    }
    if (normalized === 'it경영과' || normalized === 'itmanage') {
      return Department.ITMANAGE
    }
    if (normalized === '콘텐츠디자인과' || normalized === 'contentdesign') {
      return Department.CONTENTDESIGN
    }
    throw new BadRequestException('유효하지 않은 학과 값입니다.')
  }

  private buildSpecialityRelation(value?: string) {
    if (!value) return undefined
    return {
      connectOrCreate: {
        where: { techName: value },
        create: { techName: value },
      },
    }
  }

  async registerMember(data: CreateMemberDto) {
    try {
      return await this.prismaService.member.create({
        data: {
          generation: data.generation,
          name: data.name,
          introduction: data.introduction,
          profile_image: data.profile_image,
          department: this.resolveDepartment(data.department),
          speciality: this.buildSpecialityRelation(data.speciality),
        },
      })
    }
    catch (e) {
      if (e instanceof BadRequestException) {
        throw e
      }
      throw new InternalServerErrorException(e)
    }
  }

  async getAllMembers() {
    try {
      return await this.prismaService.member.findMany()
    }
    catch (e) {
      if (e instanceof BadRequestException) {
        throw e
      }
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

  async getMemberDetail(id: string) {
    try {
      return await this.prismaService.member.findUnique({
        where: { id },
      })
    }
    catch (e) {
      throw new InternalServerErrorException(e)
    }
  }

  async updateMemberDetail(id: string, data?: UpdateMemberDto) {
    try {
      const updateData: Record<string, unknown> = {}
      if (data?.generation !== undefined) updateData.generation = data.generation
      if (data?.name !== undefined) updateData.name = data.name
      if (data?.introduction !== undefined) updateData.introduction = data.introduction
      if (data?.profile_image !== undefined) updateData.profile_image = data.profile_image
      if (data?.department !== undefined) {
        updateData.department = this.resolveDepartment(data.department)
      }
      if (data?.speciality !== undefined) {
        updateData.speciality = this.buildSpecialityRelation(data.speciality)
      }

      return await this.prismaService.member.update({
        where: { id },
        data: updateData,
      })
    }
    catch (e) {
      throw new InternalServerErrorException(e)
    }
  }

  async deleteMember(id: string) {
    try {
      return await this.prismaService.member.delete({
        where: { id },
      })
    }
    catch (e) {
      throw new InternalServerErrorException(e)
    }
  }

  async deleteManyMembersByIds(ids: string[]) {
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
