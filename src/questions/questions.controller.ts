import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { CreateFAQDto } from './dto/register.dto';
import { EditFAQDto } from './dto/edit.dto';
import { DeleteFAQDto } from './dto/delete.dto';

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
  async getAllFAQ() {}

  @Patch()
  @UseGuards(AdminGuard)
  @SetMetadata('permission', 'MANAGER')
  async editFAQ(@Body() editFAQDto: EditFAQDto) {
    return await this.questionsService.updateFaq(editFAQDto);
  }

  @Delete()
  @UseGuards(AdminGuard)
  @SetMetadata('permission', 'MANAGER')
  async deleteFAQDto(@Body() deleteFAQDto: DeleteFAQDto) {}
}
