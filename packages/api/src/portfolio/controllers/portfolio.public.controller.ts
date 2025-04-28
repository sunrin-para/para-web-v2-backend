import { Controller, Get, Param } from '@nestjs/common'
import { PortfolioService } from '@/portfolio/portfolio.service'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'
import { PortfolioDto } from '../dto/portfolio.dto'

@Controller('portfolio')
export class PortfolioPublicController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @ApiOperation({ summary: '포트폴리오 검색' })
  @ApiResponse({ type: PortfolioDto, isArray: true })
  @Get('/search/:keyword')
  async searchPortfolioByName(@Param('keyword') keyword: string) {
    return await this.portfolioService.searchPortfolioByName(keyword)
  }

  @ApiOperation({ summary: '포트폴리오 상세 조회' })
  @ApiResponse({ type: PortfolioDto })
  @Get('/id/:id')
  async getPortfolioDetail(@Param('id') portfolioUUID: string) {
    return await this.portfolioService.getPortfolioDetail(portfolioUUID)
  }

  @ApiOperation({ summary: '카테고리별 포트폴리오 조회' })
  @ApiResponse({ type: PortfolioDto, isArray: true })
  @Get('/category/:category')
  async getPortfoliosByCategory(@Param('category') category: string) {
    return await this.portfolioService.getPortfoliosByCategory(category)
  }

  @ApiOperation({ summary: '전체 포트폴리오 조회' })
  @ApiResponse({ type: PortfolioDto, isArray: true })
  @Get('/all/portfolio')
  async getPortfolioList() {
    return await this.portfolioService.getPortfolioList()
  }

  @ApiOperation({ summary: '전체 카테고리 조회' })
  @ApiResponse({ type: String, isArray: true })
  @Get('/all/category')
  async getTagsList() {
    return await this.portfolioService.getTagsList()
  }
}
