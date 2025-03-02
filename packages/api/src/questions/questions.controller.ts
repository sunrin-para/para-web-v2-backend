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
} from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { AdminGuard } from '@/auth/guards/admin.guard';
import { CreateFAQDto } from './dto/register.dto';
import { FAQDto } from './dto/get.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @ApiBearerAuth()
  @Post()
  @UseGuards(AdminGuard)
  @SetMetadata('permission', 'MANAGER')
  async createFAQ(@Body() createFAQDto: CreateFAQDto) {
    return await this.questionsService.createFaq(createFAQDto);
  }

  @Get()
  async getAllFAQ(): Promise<FAQDto[]> {
    return await this.questionsService.getAllFaq();
  }

  @ApiBearerAuth()
  @Put('/:id')
  @UseGuards(AdminGuard)
  @SetMetadata('permission', 'MANAGER')
  async editFAQ(@Param('id') faqId: number, @Body() editFAQDto: CreateFAQDto) {
    return await this.questionsService.updateFaq(faqId, editFAQDto);
  }

  @ApiBearerAuth()
  @Delete('/:id')
  @UseGuards(AdminGuard)
  @SetMetadata('permission', 'MANAGER')
  async deleteFAQDto(@Param('id') faqId: number) {
    return await this.questionsService.deleteFaq(faqId);
  }
}
