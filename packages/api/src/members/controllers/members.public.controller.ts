import { Controller, Get, Param } from '@nestjs/common';
import { MembersService } from '@/members/members.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MemberDto } from '../dto/member.dto';

@Controller('members')
export class MembersPublicController {
  constructor(private readonly membersService: MembersService) {}

  @ApiOperation({ summary: '전체 부원 정보 조회' })
  @ApiResponse({ type: MemberDto, isArray: true })
  @Get()
  async getAllMembers() {
    return await this.membersService.getAllMembers();
  }

  @ApiOperation({ summary: '기수별 부원 정보 조회' })
  @ApiResponse({ type: MemberDto, isArray: true })
  @Get('/generation/:generation')
  async getMembersByGeneration(@Param('generation') generation: number) {
    return await this.membersService.getMembersByGeneration(generation);
  }

  @ApiOperation({ summary: '부원 상세 정보 조회' })
  @ApiResponse({ type: MemberDto })
  @Get('/id/:memberId')
  async getMemberDetail(@Param('memberId') memberId: number) {
    return await this.membersService.getMemberDetail(memberId);
  }
}
