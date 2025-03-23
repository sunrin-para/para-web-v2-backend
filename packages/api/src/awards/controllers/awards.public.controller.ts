import { Controller, Get, Param } from '@nestjs/common';
import { AwardsService } from '@/awards/awards.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AwardsDto } from '@/awards/dto/awards.dto';

@Controller('awards')
export class AwardsPublicController {
  constructor(private readonly awardsService: AwardsService) {}

  @ApiOperation({ summary: '전체 수상 실적 조회 ' })
  @ApiResponse({ type: AwardsDto, isArray: true })
  @Get()
  async getAllAwards() {
    return await this.awardsService.getAllAwards();
  }

  @ApiOperation({ summary: '연도별 수상 실적 조회' })
  @ApiResponse({ type: AwardsDto, isArray: true })
  @Get('/year/:year')
  async getAwardsHistory(@Param('year') year: number) {
    return await this.awardsService.getAwardsHistoryByYear(year);
  }

  @ApiOperation({ summary: '대회 이름으로 수상 기록 검색' })
  @ApiResponse({ type: AwardsDto, isArray: true })
  @Get('/search/:keyword')
  async searchAwardsByKeyword(keyword: string) {
    return await this.awardsService.searchAwardsByKeyword(keyword);
  }
}
