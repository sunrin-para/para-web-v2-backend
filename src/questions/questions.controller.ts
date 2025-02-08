import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { CreateFAQDto } from './dto/register.dto';
import { FAQDto } from './dto/get.dto';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

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

  @Put('/:id')
  @UseGuards(AdminGuard)
  @SetMetadata('permission', 'MANAGER')
  async editFAQ(@Param() faqId: number, @Body() editFAQDto: CreateFAQDto) {
    return await this.questionsService.updateFaq(faqId, editFAQDto);
  }

  @Delete('/:id')
  @UseGuards(AdminGuard)
  @SetMetadata('permission', 'MANAGER')
  async deleteFAQDto(@Param('id') faqId: number) {
    return await this.questionsService.deleteFaq(faqId);
  }
}
