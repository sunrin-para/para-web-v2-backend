import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsString } from 'class-validator'

export class BatchDeleteAwardsDto {
  @ApiProperty({ description: '삭제할 수상 실적 ID 목록', type: [String] })
  @IsArray()
  @IsString({ each: true })
  ids: string[]
}
