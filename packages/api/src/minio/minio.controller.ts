import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  SetMetadata,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { MinioService } from './minio.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AdminGuard } from '@/auth/guards/admin.guard';
import { FileType } from '@/common/enums/FileType.enum';

@ApiBearerAuth()
@ApiTags('Minio')
@Controller('minio')
export class MinioController {
  constructor(private readonly minioService: MinioService) {}

  @ApiOperation({ summary: '파일 복수 업로드' })
  @ApiResponse({
    status: 200,
    description: '파일 업로드 성공',
    schema: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
  })
  @Post('/:type')
  @UseGuards(AdminGuard)
  @SetMetadata('permission', 'MANAGER')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFile(
    @Param('type') type: string,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const filesUrlList: string[] = [];
    for (const file of files) {
      const fileUrl = await this.minioService.uploadFile(
        new File([file.buffer], file.originalname),
        this.minioService.generateFilename(file.originalname),
        FileType[type.toUpperCase()],
      );
      filesUrlList.push(fileUrl);
    }
    return filesUrlList;
  }

  @Get('/:type/:filename')
  async getFile(
    @Param('type') type: string,
    @Param('filename') filename: string,
  ) {
    return await this.minioService.getFile(
      FileType[type.toUpperCase()],
      filename,
    );
  }

  @Delete('/:type/:filename')
  @UseGuards(AdminGuard)
  @SetMetadata('permission', 'MANAGER')
  async deleteFile(
    @Param('type') type: string,
    @Param('filename') filename: string,
  ) {
    return await this.minioService.deleteFile(
      FileType[type.toUpperCase()],
      filename,
    );
  }
}
