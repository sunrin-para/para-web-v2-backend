import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsString } from 'class-validator'

export class BatchDeleteMembersDto {
  @ApiProperty({ description: '삭제할 멤버 ID 목록', type: [String] })
  @IsArray()
  @IsString({ each: true })
  ids: string[]
}
