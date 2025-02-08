import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  SetMetadata,
  UseGuards,
  Body,
  Param,
} from '@nestjs/common';
import { AwardsService } from './awards.service';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { CreateAwardsDto } from './dto/createAwards.dto';

@Controller('awards')
export class AwardsController {
  constructor(private readonly awardsService: AwardsService) {}

  @Post()
  @UseGuards(AdminGuard)
  @SetMetadata('permission', 'MANAGER')
  async createAwardsHistory(@Body() createAwardsDto: CreateAwardsDto) {
    return await this.awardsService.createAwardsHistory(createAwardsDto);
  }

  @Get('/:year')
  async getAwardsHistory(@Param('year') year: number) {
    return await this.awardsService.getAwardsHistoryByYear(year);
  }

  @Put('/:id')
  @UseGuards(AdminGuard)
  @SetMetadata('permission', 'MANAGER')
  async updateAwardsHistory() {}

  @Delete('/:id')
  @UseGuards(AdminGuard)
  @SetMetadata('permission', 'MANAGER')
  async deleteAwardsHistory() {}
}
