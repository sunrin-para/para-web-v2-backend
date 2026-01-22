import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsString } from 'class-validator'

export class BatchDeleteQuestionsDto {
  @ApiProperty({ description: '삭제할 FAQ ID 목록', type: [String] })
  @IsArray()
  @IsString({ each: true })
  ids: string[]
}
