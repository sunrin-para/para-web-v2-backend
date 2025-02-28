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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiConsumes,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { FormDataToArrayPipe } from 'src/common/pipes/form-data-to-array.pipe';

@ApiTags('Portfolio')
@Controller('portfolio')
export class PortfolioController {
  constructor(
    private readonly portfolioService: PortfolioService,
    private readonly minioService: MinioService,
  ) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: '포트폴리오 생성',
    description: '새로운 포트폴리오를 생성합니다.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        thumbnail: {
          type: 'string',
          format: 'binary',
          description: '썸네일 이미지 파일',
        },
        portfolioPdf: {
          type: 'string',
          format: 'binary',
          description: '포트폴리오 PDF 파일',
        },
        title: {
          type: 'string',
          description: '포트폴리오 제목',
        },
        summary: {
          type: 'string',
          description: '포트폴리오 요약',
        },
        description: {
          type: 'string',
          description: '포트폴리오 상세 설명',
        },
        tags: {
          type: 'string',
          description:
            '포트폴리오 태그 목록 (JSON 배열 문자열 또는 쉼표로 구분된 문자열)',
          example: '["React", "NestJS", "TypeScript"]',
        },
        para_member: {
          type: 'string',
          description:
            '파라 멤버 목록 (JSON 배열 문자열 또는 쉼표로 구분된 문자열)',
          example: '["홍길동", "김철수"]',
        },
        outside_member: {
          type: 'string',
          description:
            '외부 멤버 목록 (JSON 배열 문자열 또는 쉼표로 구분된 문자열)',
          example: '["이영희", "박민수"]',
        },
        date: {
          type: 'string',
          description: '포트폴리오 관련 날짜들 (JSON 배열 문자열)',
          example: '["2024-01-01T00:00:00.000Z", "2024-12-31T00:00:00.000Z"]',
        },
        link: {
          type: 'string',
          description: '관련 링크',
        },
        github: {
          type: 'string',
          description: '깃허브 링크'
        }
      },
    },
  })
  @ApiResponse({ status: 201, description: '포트폴리오 생성 성공' })
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
    @Body(new FormDataToArrayPipe()) createPortfolioDto: CreatePortfolioDto,
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

  @ApiOperation({
    summary: '포트폴리오 검색',
    description: '키워드로 포트폴리오를 검색합니다.',
  })
  @ApiParam({ name: 'keyword', description: '검색 키워드' })
  @ApiResponse({ status: 200, description: '검색 성공' })
  @Get('/search/:keyword')
  async searchPortfolioByName(@Param('keyword') keyword: string) {
    return await this.portfolioService.searchPortfolioByName(keyword);
  }

  @ApiOperation({
    summary: '포트폴리오 상세 조회',
    description: 'ID로 포트폴리오 상세 정보를 조회합니다.',
  })
  @ApiParam({ name: 'id', description: '포트폴리오 ID' })
  @ApiResponse({ status: 200, description: '조회 성공' })
  @Get('/id/:id')
  async getPortfolioDetail(@Param('id') portfolioId: string) {
    return await this.portfolioService.getPortfolioDetail(
      parseInt(portfolioId),
    );
  }

  @ApiOperation({
    summary: '카테고리별 포트폴리오 조회',
    description: '특정 카테고리의 포트폴리오 목록을 조회합니다.',
  })
  @ApiParam({ name: 'category', description: '카테고리명' })
  @ApiResponse({ status: 200, description: '조회 성공' })
  @Get('/category/:category')
  async getPortfoliosByCategory(@Param('category') category: string) {
    return await this.portfolioService.getPortfoliosByCategory(category);
  }

  @ApiOperation({
    summary: '전체 포트폴리오 조회',
    description: '모든 포트폴리오 목록을 조회합니다.',
  })
  @ApiResponse({ status: 200, description: '조회 성공' })
  @Get('/all/portfolio')
  async getPortfolioList() {
    return await this.portfolioService.getPortfolioList();
  }

  @ApiOperation({
    summary: '전체 카테고리 조회',
    description: '모든 태그(카테고리) 목록을 조회합니다.',
  })
  @ApiResponse({ status: 200, description: '조회 성공' })
  @Get('/all/category')
  async getTagsList() {
    return await this.portfolioService.getTagsList();
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: '포트폴리오 수정',
    description: '기존 포트폴리오 정보를 수정합니다.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        thumbnail: {
          type: 'string',
          format: 'binary',
          description: '썸네일 이미지 파일',
        },
        portfolioPdf: {
          type: 'string',
          format: 'binary',
          description: '포트폴리오 PDF 파일',
        },
        title: {
          type: 'string',
          description: '포트폴리오 제목',
        },
        summary: {
          type: 'string',
          description: '포트폴리오 요약',
        },
        description: {
          type: 'string',
          description: '포트폴리오 상세 설명',
        },
        tags: {
          type: 'string',
          description:
            '포트폴리오 태그 목록 (JSON 배열 문자열 또는 쉼표로 구분된 문자열)',
          example: '["React", "NestJS", "TypeScript"]',
        },
        para_member: {
          type: 'string',
          description:
            '파라 멤버 목록 (JSON 배열 문자열 또는 쉼표로 구분된 문자열)',
          example: '["홍길동", "김철수"]',
        },
        outside_member: {
          type: 'string',
          description:
            '외부 멤버 목록 (JSON 배열 문자열 또는 쉼표로 구분된 문자열)',
          example: '["이영희", "박민수"]',
        },
        date: {
          type: 'string',
          description: '포트폴리오 관련 날짜들 (JSON 배열 문자열)',
          example: '["2024-01-01T00:00:00.000Z", "2024-12-31T00:00:00.000Z"]',
        },
        link: {
          type: 'string',
          description: '관련 링크',
        },
      },
    },
  })
  @ApiParam({ name: 'id', description: '포트폴리오 ID' })
  @ApiResponse({ status: 200, description: '수정 성공' })
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
    @Param('id') portfolioId: string,
    @Body(new FormDataToArrayPipe()) updatePortfolioDto?: UpdatePortfolioDto,
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
      parseInt(portfolioId),
      updatePortfolioDto,
      thumbnailUrl,
      portfolioUrl,
    );
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: '포트폴리오 삭제',
    description: '포트폴리오를 삭제합니다.',
  })
  @ApiParam({ name: 'id', description: '포트폴리오 ID' })
  @ApiResponse({ status: 200, description: '삭제 성공' })
  @Delete('/:id')
  @UseGuards(AdminGuard)
  @SetMetadata('permission', 'MANAGER')
  async deletePortfolio(@Param('id') portfolioId: string) {
    return await this.portfolioService.deletePortfolio(parseInt(portfolioId));
  }
}
