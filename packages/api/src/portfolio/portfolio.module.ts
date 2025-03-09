import { Module } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { PortfolioRepository } from './repository/portfolio.repo';
import { PortfolioPublicController } from './controllers/portfolio.public.controller';
import { PortfolioPrivateController } from './controllers/portfolio.private.controller';

@Module({
  controllers: [PortfolioPublicController, PortfolioPrivateController],
  providers: [PortfolioRepository, PortfolioService],
})
export class PortfolioModule {}
