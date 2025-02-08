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
  async updateAwardsHistory(
    @Param('id') id: number,
    @Body() updateAwardDto: CreateAwardsDto,
  ) {
    return await this.awardsService.updateAwardsHistory(id, updateAwardDto);
  }

  @Delete('/id/:id')
  @UseGuards(AdminGuard)
  @SetMetadata('permission', 'MANAGER')
  async deleteAwardsHistoryById(@Param('id') id: number) {
    return await this.awardsService.deleteAwardById(id);
  }

  @Delete('/year/:year')
  @UseGuards(AdminGuard)
  @SetMetadata('permission', 'MANAGER')
  async deleteManyAwardsHistoryByYear(@Param('year') year: number) {
    return await this.awardsService.deleteManyAwardsByYear(year);
  }
}
