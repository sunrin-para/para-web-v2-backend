import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  SetMetadata,
  UseGuards,
  Body,
  Param,
} from '@nestjs/common';
import { AwardsService } from './awards.service';
import { AdminGuard } from '@/auth/guards/admin.guard';
import { CreateAwardsDto } from './dto/createAwards.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AwardsDto } from './dto/awards.dto';

@Controller('awards')
export class AwardsController {
  constructor(private readonly awardsService: AwardsService) {}

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @SetMetadata('permission', 'MANAGER')
  @ApiOperation({ summary: '수상 실적 생성' })
  @ApiResponse({ type: AwardsDto })
  @Post()
  async createAwardsHistory(@Body() createAwardsDto: CreateAwardsDto) {
    return await this.awardsService.createAwardsHistory(createAwardsDto);
  }

  @ApiOperation({ summary: '연도별 수상 실적 조회' })
  @ApiResponse({ type: AwardsDto, isArray: true })
  @Get('/:year')
  async getAwardsHistory(@Param('year') year: number) {
    return await this.awardsService.getAwardsHistoryByYear(year);
  }

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @SetMetadata('permission', 'MANAGER')
  @ApiOperation({ summary: '수상 실적 수정' })
  @ApiResponse({ type: AwardsDto })
  @Put('/:id')
  async updateAwardsHistory(
    @Param('id') id: number,
    @Body() updateAwardDto: CreateAwardsDto,
  ) {
    return await this.awardsService.updateAwardsHistory(id, updateAwardDto);
  }

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @SetMetadata('permission', 'MANAGER')
  @ApiOperation({ summary: '수상 실적 삭제' })
  @ApiResponse({ type: Boolean })
  @Delete('/id/:id')
  async deleteAwardsHistoryById(@Param('id') id: number) {
    return await this.awardsService.deleteAwardById(id);
  }

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @SetMetadata('permission', 'MANAGER')
  @ApiOperation({ summary: '연도 단위 수상 실적 삭제' })
  @ApiResponse({ type: Boolean })
  @Delete('/year/:year')
  async deleteManyAwardsHistoryByYear(@Param('year') year: number) {
    return await this.awardsService.deleteManyAwardsByYear(year);
  }
}
