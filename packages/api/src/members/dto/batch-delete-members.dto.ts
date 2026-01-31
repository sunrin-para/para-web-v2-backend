import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsArray, IsInt } from 'class-validator'

export class BatchDeleteMembersDto {
  @ApiProperty({ description: '삭제할 멤버 ID 목록', type: [Number] })
  @IsArray()
  @Type(() => Number)
  @IsInt({ each: true })
  ids: number[]
}
