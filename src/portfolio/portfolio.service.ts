import { BadRequestException, Injectable } from '@nestjs/common';
import { PortfolioRepository } from './repository/portfolio.repo';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';

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

  async deletePortfolio(portfolioId: number) {
    if (portfolioId < 0) {
      throw new BadRequestException('portfolio ID 값은 0보다 커야 합니다.');
    }
    return await this.portfolioRepository.deletePortfolio(portfolioId);
  }
}
