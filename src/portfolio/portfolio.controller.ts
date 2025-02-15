import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  SetMetadata,
  UseInterceptors,
  UseGuards,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { MinioService } from 'src/minio/minio.service';
import { FileType } from 'src/multer.config';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';

@Controller('portfolio')
export class PortfolioController {
  constructor(
    private readonly portfolioService: PortfolioService,
    private readonly minioService: MinioService,
  ) {}

  @Post()
  @UseGuards(AdminGuard)
  @SetMetadata('permission', 'MANAGER')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'thumbnail', maxCount: 1 },
      { name: 'portfolioPdf', maxCount: 1 },
    ]),
  )
  async createPortfolio(
    @Body() createPortfolioDto: CreatePortfolioDto,
    @UploadedFiles()
    files: {
      thumbnail: Express.Multer.File[];
      portfolioPdf: Express.Multer.File[];
    },
  ) {
    const thumbnailUrl = await this.minioService.uploadFile(
      new File([files.thumbnail[0].buffer], files.thumbnail[0].originalname),
      this.minioService.generateFilename(files.thumbnail[0].originalname),
      FileType.PORTFOLIO,
    );
    const portfolioUrl = await this.minioService.uploadFile(
      new File(
        [files.portfolioPdf[0].buffer],
        files.portfolioPdf[0].originalname,
      ),
      this.minioService.generateFilename(files.portfolioPdf[0].originalname),
      FileType.PORTFOLIO,
    );
    const result = await this.portfolioService.createPortfolio(
      createPortfolioDto,
      thumbnailUrl,
      portfolioUrl,
    );
    return result;
  }

  @Get('/search/:keyword')
  async searchPortfolioByName(@Param('keyword') keyword: string) {
    return await this.portfolioService.searchPortfolioByName(keyword);
  }

  @Get('/id/:id')
  async getPortfolioDetail(@Param('id') portfolioId: number) {
    return await this.portfolioService.getPortfolioDetail(portfolioId);
  }

  @Get('/category/:category')
  async getPortfoliosByCategory(@Param('category') category: string) {
    return await this.portfolioService.getPortfoliosByCategory(category);
  }

  @Get('/all/portfolio')
  async getPortfolioList() {
    return await this.portfolioService.getPortfolioList();
  }

  @Get('/all/category')
  async getTagsList() {
    return await this.portfolioService.getTagsList();
  }

  @Patch('/:id')
  @UseGuards(AdminGuard)
  @SetMetadata('permission', 'MANAGER')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'thumbnail', maxCount: 1 },
      { name: 'portfolioPdf', maxCount: 1 },
    ]),
  )
  async updatePortfolio(
    @Param('id') portfolioId: number,
    @Body() updatePortfolioDto?: UpdatePortfolioDto,
    @UploadedFiles()
    files?: {
      thumbnail?: Express.Multer.File[];
      portfolioPdf?: Express.Multer.File[];
    },
  ) {
    let thumbnailUrl = files.thumbnail[0]
      ? await this.minioService.uploadFile(
          new File(
            [files.thumbnail[0].buffer],
            files.thumbnail[0].originalname,
          ),
          this.minioService.generateFilename(files.thumbnail[0].originalname),
          FileType.PORTFOLIO,
        )
      : null;
    let portfolioUrl = files.portfolioPdf[0]
      ? await this.minioService.uploadFile(
          new File(
            [files.portfolioPdf[0].buffer],
            files.portfolioPdf[0].originalname,
          ),
          this.minioService.generateFilename(
            files.portfolioPdf[0].originalname,
          ),
          FileType.PORTFOLIO,
        )
      : null;
    return await this.portfolioService.updatePortfolio(
      portfolioId,
      updatePortfolioDto,
      thumbnailUrl,
      portfolioUrl,
    );
  }

  @Delete('/:id')
  @UseGuards(AdminGuard)
  @SetMetadata('permission', 'MANAGER')
  async deletePortfolio(@Param('id') portfolioId: number) {
    return await this.portfolioService.deletePortfolio(portfolioId);
  }
}
