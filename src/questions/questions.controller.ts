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
  @SetMetadata('permission', 'NOT SET')
  async createFAQ(@Body() createFAQDto: CreateFAQDto) {}

  @Get()
  async getAllFAQ() {}

  @Patch()
  @UseGuards(AdminGuard)
  @SetMetadata('permission', 'NOT SET')
  async editFAQ(@Body() editFAQDto: EditFAQDto) {}

  @Delete()
  @UseGuards(AdminGuard)
  @SetMetadata('permission', 'NOT SET')
  async DeleteFAQDto(@Body() deleteFAQDto: DeleteFAQDto) {}
}
