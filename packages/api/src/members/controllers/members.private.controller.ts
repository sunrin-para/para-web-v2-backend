import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  SetMetadata,
  ParseIntPipe,
} from '@nestjs/common'
import { MembersService } from '@/members/members.service'
import { AdminGuard } from '@/auth/guards/admin.guard'
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { UpdateMemberDto } from '@/members/dto/update-member.dto'
import { CreateMemberDto } from '@/members/dto/create-member.dto'
import { BatchUpsertMembersDto } from '@/members/dto/batch-upsert-members.dto'
import { BatchDeleteMembersDto } from '@/members/dto/batch-delete-members.dto'
import { MemberDto } from '../dto/member.dto'

@Controller('members')
@SetMetadata('permission', 'MANAGER')
@UseGuards(AdminGuard)
@ApiBearerAuth()
export class MembersPrivateController {
  constructor(private readonly membersService: MembersService) {}

  @ApiOperation({ summary: '부원 정보 등록' })
  @ApiResponse({ type: MemberDto })
  @Post()
  async createMember(@Body() createMemberDto: CreateMemberDto) {
    return await this.membersService.createMember(createMemberDto)
  }

  @ApiOperation({ summary: '부원 정보 일괄 등록/수정' })
  @ApiResponse({ type: Object })
  @Post('/batch')
  async batchUpsertMembers(@Body() batchDto: BatchUpsertMembersDto) {
    return await this.membersService.batchUpsertMembers(
      batchDto.createItems,
      batchDto.updateItems,
    )
  }

  @ApiOperation({ summary: '부원 정보 수정' })
  @ApiResponse({ type: MemberDto })
  @Patch('/:memberUUID')
  async updateMemberDetail(
    @Param('memberUUID', ParseIntPipe) memberUUID: number,
    @Body() updateMemberDto?: UpdateMemberDto,
  ) {
    return await this.membersService.updateMemberDetail(
      memberUUID,
      updateMemberDto,
    )
  }

  @ApiOperation({ summary: '부원 정보 일괄 삭제' })
  @ApiResponse({ type: Object })
  @Delete('/batch')
  async deleteMembers(@Body() deleteDto: BatchDeleteMembersDto) {
    return await this.membersService.deleteManyMembersByIds(deleteDto.ids)
  }

  @ApiOperation({ summary: '부원 정보 삭제' })
  @ApiResponse({ type: Boolean })
  @Delete('/:memberUUID')
  async deleteMember(
    @Param('memberUUID', ParseIntPipe) memberUUID: number,
  ) {
    return await this.membersService.deleteMember(memberUUID)
  }
}
