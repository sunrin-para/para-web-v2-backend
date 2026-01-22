import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsString } from 'class-validator'

export class BatchDeletePortfolioDto {
  @ApiProperty({ description: '삭제할 포트폴리오 ID 목록', type: [String] })
  @IsArray()
  @IsString({ each: true })
  ids: string[]
}
