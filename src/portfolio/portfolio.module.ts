import { Module } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { PortfolioController } from './portfolio.controller';
import { PortfolioRepository } from './repository/portfolio.repo';
import { MinioService } from 'src/minio/minio.service';

@Module({
  controllers: [PortfolioController],
  providers: [PortfolioRepository, PortfolioService, MinioService],
})
export class PortfolioModule {}
