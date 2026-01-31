import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsArray, IsInt } from 'class-validator'

export class BatchDeletePortfolioDto {
  @ApiProperty({ description: '삭제할 포트폴리오 ID 목록', type: [Number] })
  @IsArray()
  @Type(() => Number)
  @IsInt({ each: true })
  ids: number[]
}
