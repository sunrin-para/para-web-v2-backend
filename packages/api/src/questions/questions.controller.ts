import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  SetMetadata,
  UseGuards,
} from '@nestjs/common'
import { QuestionsService } from './questions.service'
import { AdminGuard } from '@/auth/guards/admin.guard'
import { CreateFAQDto } from './dto/register.dto'
import { BatchUpsertQuestionsDto } from './dto/batch-upsert-questions.dto'
import { BatchDeleteQuestionsDto } from './dto/batch-delete-questions.dto'
import { FAQDto } from './dto/get.dto'
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger'

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @SetMetadata('permission', 'MANAGER')
  @ApiOperation({ summary: 'FAQ 생성' })
  @ApiResponse({ type: FAQDto })
  @Post()
  async createFAQ(@Body() createFAQDto: CreateFAQDto) {
    return await this.questionsService.createFaq(createFAQDto)
  }

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @SetMetadata('permission', 'MANAGER')
  @ApiOperation({ summary: 'FAQ 일괄 생성/수정' })
  @ApiResponse({ type: Object })
  @Post('/batch')
  async batchUpsertFAQ(@Body() batchDto: BatchUpsertQuestionsDto) {
    return await this.questionsService.batchUpsertFaqs(
      batchDto.createItems,
      batchDto.updateItems,
    )
  }

  @ApiOperation({ summary: 'FAQ 목록 조회' })
  @ApiResponse({ type: FAQDto, isArray: true })
  @Get()
  async getAllFAQ() {
    return await this.questionsService.getAllFaq()
  }

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @SetMetadata('permission', 'MANAGER')
  @ApiOperation({ summary: 'FAQ 일괄 삭제' })
  @ApiResponse({ type: Object })
  @Delete('/batch')
  async deleteFAQBatch(@Body() deleteDto: BatchDeleteQuestionsDto) {
    const ids = deleteDto.ids
      .map((value) => Number(value))
      .filter((value) => !Number.isNaN(value))
    return await this.questionsService.deleteManyFaqByIds(ids)
  }

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @SetMetadata('permission', 'MANAGER')
  @ApiOperation({ summary: 'FAQ 수정' })
  @ApiResponse({ type: FAQDto })
  @Put('/:id')
  async editFAQ(@Param('id') faqId: number, @Body() editFAQDto: CreateFAQDto) {
    return await this.questionsService.updateFaq(faqId, editFAQDto)
  }

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @SetMetadata('permission', 'MANAGER')
  @ApiOperation({ summary: 'FAQ 삭제' })
  @ApiResponse({ type: Boolean })
  @Delete('/:id')
  async deleteFAQDto(@Param('id') faqId: number) {
    return await this.questionsService.deleteFaq(faqId)
  }
}
