import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PortfolioRepository } from './repository/portfolio.repo';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { PortfolioDto } from './dto/portfolio.dto';
import { MonoPortfolioList } from './dto/portfolio-list.dto';

@Injectable()
export class PortfolioService {
  constructor(private readonly portfolioRepository: PortfolioRepository) {}

  async createPortfolio(
    createPortfolioDto: CreatePortfolioDto,
    thumbnailUrl: string,
    portfolioUrl: string,
  ) {
    const newPortfolio: CreatePortfolioDto = {
      filePath: portfolioUrl,
      thumbnail: thumbnailUrl,
      ...createPortfolioDto,
    };
    await this.portfolioRepository.createPortfolio(newPortfolio);
  }

  async searchPortfolioByName(keyword: string): Promise<MonoPortfolioList[]> {
    return await this.portfolioRepository.searchPortfolioByName(keyword);
  }

  async getPortfolioDetail(portfolioId: number): Promise<PortfolioDto> {
    return await this.portfolioRepository.getPortfolioDetail(portfolioId);
  }

  async getPortfoliosByCategory(
    category: string,
  ): Promise<MonoPortfolioList[]> {
    return await this.portfolioRepository.getPortfoliosByCategory(category);
  }

  async getPortfolioList(count: number = 50): Promise<MonoPortfolioList[]> {
    return await this.portfolioRepository.getPortfolioList(count);
  }

  async getTagsList() {
    return await this.portfolioRepository.getAllCategories();
  }

  async updatePortfolio(
    portfolioId: number,
    updatePortfolioDto?: Partial<UpdatePortfolioDto>,
    thumbnailUrl?: string,
    portfolioUrl?: string,
  ) {
    if (!updatePortfolioDto && !thumbnailUrl && !portfolioUrl) {
      throw new BadRequestException('수정할 정보가 제공되지 않았습니다.');
    }
    if (thumbnailUrl) updatePortfolioDto.thumbnail = thumbnailUrl;
    if (portfolioUrl) updatePortfolioDto.filePath = portfolioUrl;
    return await this.portfolioRepository.updatePortfolio(
      portfolioId,
      updatePortfolioDto,
    );
  }

  async deletePortfolio(portfolioId: number) {
    return await this.portfolioRepository.deletePortfolio(portfolioId);
  }
}
