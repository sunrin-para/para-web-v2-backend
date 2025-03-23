import {
  Controller,
  Post,
  Put,
  Delete,
  SetMetadata,
  UseGuards,
  Body,
  Param,
} from '@nestjs/common';
import { AwardsService } from '@/awards/awards.service';
import { AdminGuard } from '@/auth/guards/admin.guard';
import { CreateAwardsDto } from '@/awards/dto/createAwards.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AwardsDto } from '@/awards/dto/awards.dto';

@ApiBearerAuth()
@SetMetadata('permission', 'MANAGER')
@UseGuards(AdminGuard)
@Controller('awards')
export class AwardsPrivateController {
  constructor(private readonly awardsService: AwardsService) {}

  @ApiOperation({ summary: '수상 실적 생성' })
  @ApiResponse({ type: AwardsDto })
  @Post()
  async createAwardsHistory(@Body() createAwardsDto: CreateAwardsDto) {
    return await this.awardsService.createAwardsHistory(createAwardsDto);
  }

  @ApiOperation({ summary: "포트폴리오와 연동" })
  @ApiResponse({ type: AwardsDto })
  @Post('/:awardId/connect')


  @ApiOperation({ summary: '수상 실적 수정' })
  @ApiResponse({ type: AwardsDto })
  @Put('/:id')
  async updateAwardsHistory(
    @Param('id') id: number,
    @Body() updateAwardDto: CreateAwardsDto,
  ) {
    return await this.awardsService.updateAwardsHistory(id, updateAwardDto);
  }

  @ApiOperation({ summary: '수상 실적 삭제' })
  @ApiResponse({ type: Boolean })
  @Delete('/id/:id')
  async deleteAwardsHistoryById(@Param('id') id: number) {
    return await this.awardsService.deleteAwardById(id);
  }

  @ApiOperation({ summary: '연도 단위 수상 실적 삭제' })
  @ApiResponse({ type: Boolean })
  @Delete('/year/:year')
  async deleteManyAwardsHistoryByYear(@Param('year') year: number) {
    return await this.awardsService.deleteManyAwardsByYear(year);
  }
}
