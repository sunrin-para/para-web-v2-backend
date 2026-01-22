import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  SetMetadata,
  UseGuards,
} from '@nestjs/common'
import { PortfolioService } from '@/portfolio/portfolio.service'
import { AdminGuard } from '@/auth/guards/admin.guard'
import { CreatePortfolioDto } from '@/portfolio/dto/create-portfolio.dto'
import { UpdatePortfolioDto } from '@/portfolio/dto/update-portfolio.dto'
import { BatchUpsertPortfolioDto } from '@/portfolio/dto/batch-upsert-portfolio.dto'
import { BatchDeletePortfolioDto } from '@/portfolio/dto/batch-delete-portfolio.dto'
import { ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { PortfolioDto } from '../dto/portfolio.dto'

@Controller('portfolio')
@SetMetadata('permission', 'MANAGER')
@UseGuards(AdminGuard)
@ApiBearerAuth()
export class PortfolioPrivateController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @ApiOperation({ summary: '포트폴리오 생성' })
  @ApiResponse({ type: PortfolioDto })
  @Post()
  async createPortfolio(@Body() createPortfolioDto: CreatePortfolioDto) {
    return await this.portfolioService.createPortfolio(createPortfolioDto)
  }

  @ApiOperation({ summary: '포트폴리오 일괄 생성/수정' })
  @ApiResponse({ type: Object })
  @Post('/batch')
  async batchUpsertPortfolio(@Body() batchDto: BatchUpsertPortfolioDto) {
    return await this.portfolioService.batchUpsertPortfolios(
      batchDto.createItems,
      batchDto.updateItems,
    )
  }

  @ApiOperation({ summary: '포트폴리오 수정' })
  @ApiResponse({ type: PortfolioDto })
  @Patch('/:portfolioUUID')
  async updatePortfolio(
    @Param('portfolioUUID') portfolioUUID: string,
    @Body() updatePortfolioDto?: UpdatePortfolioDto,
  ) {
    return await this.portfolioService.updatePortfolio(
      portfolioUUID,
      updatePortfolioDto,
    )
  }

  @ApiOperation({ summary: '포트폴리오 일괄 삭제' })
  @ApiResponse({ type: Object })
  @Delete('/batch')
  async deletePortfolios(@Body() deleteDto: BatchDeletePortfolioDto) {
    return await this.portfolioService.deleteManyPortfoliosByIds(deleteDto.ids)
  }

  @ApiOperation({ summary: '포트폴리오 삭제' })
  @ApiResponse({ type: Boolean })
  @Delete('/:portfolioUUID')
  async deletePortfolio(@Param('portfolioUUID') portfolioUUID: string) {
    return await this.portfolioService.deletePortfolio(portfolioUUID)
  }
}
