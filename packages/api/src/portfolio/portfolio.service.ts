import { BadRequestException, Injectable } from '@nestjs/common';
import { PortfolioRepository } from './repository/portfolio.repo';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';

@Injectable()
export class PortfolioService {
  constructor(private readonly portfolioRepository: PortfolioRepository) {}

  async createPortfolio(createPortfolioDto: CreatePortfolioDto) {
    await this.portfolioRepository.createPortfolio(createPortfolioDto);
  }

  async searchPortfolioByName(keyword: string) {
    return await this.portfolioRepository.searchPortfolioByName(keyword);
  }

  async getPortfolioDetail(portfolioId: number) {
    return await this.portfolioRepository.getPortfolioDetail(portfolioId);
  }

  async getPortfoliosByCategory(category: string) {
    return await this.portfolioRepository.getPortfoliosByCategory(category);
  }

  async getPortfolioList(count: number = 50) {
    return await this.portfolioRepository.getPortfolioList(count);
  }

  async getTagsList() {
    return await this.portfolioRepository.getAllCategories();
  }

  async updatePortfolio(
    portfolioId: number,
    updatePortfolioDto?: Partial<UpdatePortfolioDto>,
  ) {
    if (!updatePortfolioDto) {
      throw new BadRequestException('수정할 정보가 제공되지 않았습니다.');
    }
    return await this.portfolioRepository.updatePortfolio(
      portfolioId,
      updatePortfolioDto,
    );
  }

  async deletePortfolio(portfolioId: number) {
    return await this.portfolioRepository.deletePortfolio(portfolioId);
  }
}
