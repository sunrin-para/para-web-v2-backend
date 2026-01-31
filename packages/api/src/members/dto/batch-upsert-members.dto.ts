import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsArray, IsInt, ValidateNested } from 'class-validator'
import { CreateMemberDto } from './create-member.dto'
import { UpdateMemberDto } from './update-member.dto'

export class MembersBatchUpdateItemDto {
  @ApiProperty({ description: '멤버 ID' })
  @Type(() => Number)
  @IsInt()
  id: number

  @ApiProperty({ description: '수정할 멤버 데이터', type: UpdateMemberDto })
  @ValidateNested()
  @Type(() => UpdateMemberDto)
  data: UpdateMemberDto
}

export class BatchUpsertMembersDto {
  @ApiProperty({
    description: '생성할 멤버 목록',
    type: CreateMemberDto,
    isArray: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMemberDto)
  createItems: CreateMemberDto[]

  @ApiProperty({
    description: '수정할 멤버 목록',
    type: MembersBatchUpdateItemDto,
    isArray: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MembersBatchUpdateItemDto)
  updateItems: MembersBatchUpdateItemDto[]
}
