import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  SetMetadata,
} from '@nestjs/common'
import { MembersService } from '@/members/members.service'
import { AdminGuard } from '@/auth/guards/admin.guard'
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { UpdateMemberDto } from '@/members/dto/update-member.dto'
import { CreateMemberDto } from '@/members/dto/create-member.dto'
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

  @ApiOperation({ summary: '부원 정보 수정' })
  @ApiResponse({ type: MemberDto })
  @Patch('/:memberUUID')
  async updateMemberDetail(
    @Param('memberUUID') memberUUID: string,
    @Body() updateMemberDto?: UpdateMemberDto,
  ) {
    return await this.membersService.updateMemberDetail(
      memberUUID,
      updateMemberDto,
    )
  }

  @ApiOperation({ summary: '부원 정보 삭제' })
  @ApiResponse({ type: Boolean })
  @Delete('/:memberUUID')
  async deleteMember(@Param('memberUUID') memberUUID: string) {
    return await this.membersService.deleteMember(memberUUID)
  }
}
