import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsArray, IsInt } from 'class-validator'

export class BatchDeleteAwardsDto {
  @ApiProperty({ description: '삭제할 수상 실적 ID 목록', type: [Number] })
  @IsArray()
  @Type(() => Number)
  @IsInt({ each: true })
  ids: number[]
}
