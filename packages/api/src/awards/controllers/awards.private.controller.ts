import {
  Controller,
  Post,
  Put,
  Delete,
  SetMetadata,
  UseGuards,
  Body,
  Param,
} from '@nestjs/common'
import { AwardsService } from '@/awards/awards.service'
import { AdminGuard } from '@/auth/guards/admin.guard'
import { CreateAwardsDto } from '@/awards/dto/createAwards.dto'
import { BatchUpsertAwardsDto } from '@/awards/dto/batch-upsert-awards.dto'
import { BatchDeleteAwardsDto } from '@/awards/dto/batch-delete-awards.dto'
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { AwardsDto } from '@/awards/dto/awards.dto'

@ApiBearerAuth()
@SetMetadata('permission', 'MANAGER')
@UseGuards(AdminGuard)
@Controller('awards')
export class AwardsPrivateController {
  constructor(private readonly awardsService: AwardsService) {}

  @ApiOperation({ summary: '수상 실적 생성' })
  @ApiResponse({ type: AwardsDto })
  @Post()
  async createAwardsHistory(@Body() createAwardsDto: CreateAwardsDto) {
    return await this.awardsService.createAwardsHistory(createAwardsDto)
  }

  @ApiOperation({ summary: '수상 실적 일괄 생성/수정' })
  @ApiResponse({ type: Object })
  @Post('/batch')
  async batchUpsertAwards(@Body() batchDto: BatchUpsertAwardsDto) {
    return await this.awardsService.batchUpsertAwards(
      batchDto.createItems,
      batchDto.updateItems,
    )
  }

  @ApiOperation({ summary: '수상 실적 수정' })
  @ApiResponse({ type: AwardsDto })
  @Put('/edit/:AwardUUID')
  async updateAwardsHistory(
    @Param('AwardUUID') uuid: string,
    @Body() updateAwardDto: CreateAwardsDto,
  ) {
    return await this.awardsService.updateAwardsHistory(uuid, updateAwardDto)
  }

  @ApiOperation({ summary: '수상 실적 삭제' })
  @ApiResponse({ type: Boolean })
  @Delete('/id/:AwardUUID')
  async deleteAwardsHistoryById(@Param('AwardUUID') uuid: string) {
    return await this.awardsService.deleteAwardById(uuid)
  }

  @ApiOperation({ summary: '연도 단위 수상 실적 삭제' })
  @ApiResponse({ type: Boolean })
  @Delete('/year/:year')
  async deleteManyAwardsHistoryByYear(@Param('year') year: number) {
    return await this.awardsService.deleteManyAwardsByYear(year)
  }

  @ApiOperation({ summary: '수상 실적 일괄 삭제' })
  @ApiResponse({ type: Object })
  @Delete('/batch')
  async deleteManyAwardsHistory(@Body() deleteDto: BatchDeleteAwardsDto) {
    return await this.awardsService.deleteManyAwardsByIds(deleteDto.ids)
  }
}
