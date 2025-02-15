import { BadRequestException, Injectable } from '@nestjs/common';
import { PortfolioRepository } from './repository/portfolio.repo';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';

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

  async updatePortfolio(
    portfolioId: number,
    updatePortfolioDto?: Partial<UpdatePortfolioDto>,
    thumbnailUrl?: string,
    portfolioUrl?: string,
  ) {
    if (!updatePortfolioDto && !thumbnailUrl && !portfolioUrl) {
      throw new BadRequestException('수정할 정보가 제공되지 않았습니다.');
    }
    if (portfolioId < 0) {
      throw new BadRequestException('portfolio ID 값은 0보다 커야 합니다.');
    }
    if (thumbnailUrl) updatePortfolioDto.thumbnail = thumbnailUrl;
    if (portfolioUrl) updatePortfolioDto.filePath = portfolioUrl;
    return await this.portfolioRepository.updatePortfolio(
      portfolioId,
      updatePortfolioDto,
    );
  }

  async deletePortfolio(portfolioId: number) {
    if (portfolioId < 0) {
      throw new BadRequestException('portfolio ID 값은 0보다 커야 합니다.');
    }
    return await this.portfolioRepository.deletePortfolio(portfolioId);
  }
}
