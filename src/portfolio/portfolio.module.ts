import { Module } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { PortfolioController } from './portfolio.controller';
import { PortfolioRepository } from './repository/portfolio.repo';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [PortfolioController],
  providers: [PortfolioRepository, PortfolioService, PrismaService],
})
export class PortfolioModule {}
