import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsArray, IsInt, ValidateNested } from 'class-validator'
import { CreateAwardsDto } from './createAwards.dto'

export class AwardsBatchUpdateItemDto {
  @ApiProperty({ description: '수상 실적 ID' })
  @Type(() => Number)
  @IsInt()
  id: number

  @ApiProperty({ description: '수상 실적 데이터', type: CreateAwardsDto })
  @ValidateNested()
  @Type(() => CreateAwardsDto)
  data: CreateAwardsDto
}

export class BatchUpsertAwardsDto {
  @ApiProperty({
    description: '생성할 수상 실적 목록',
    type: CreateAwardsDto,
    isArray: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAwardsDto)
  createItems: CreateAwardsDto[]

  @ApiProperty({
    description: '수정할 수상 실적 목록',
    type: AwardsBatchUpdateItemDto,
    isArray: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AwardsBatchUpdateItemDto)
  updateItems: AwardsBatchUpdateItemDto[]
}
