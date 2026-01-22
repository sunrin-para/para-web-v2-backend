import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsArray, IsNumber, ValidateNested } from 'class-validator'
import { CreateFAQDto } from './register.dto'

export class QuestionsBatchUpdateItemDto {
  @ApiProperty({ description: 'FAQ ID' })
  @Type(() => Number)
  @IsNumber()
  id: number

  @ApiProperty({ description: '수정할 FAQ 데이터', type: CreateFAQDto })
  @ValidateNested()
  @Type(() => CreateFAQDto)
  data: CreateFAQDto
}

export class BatchUpsertQuestionsDto {
  @ApiProperty({
    description: '생성할 FAQ 목록',
    type: CreateFAQDto,
    isArray: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateFAQDto)
  createItems: CreateFAQDto[]

  @ApiProperty({
    description: '수정할 FAQ 목록',
    type: QuestionsBatchUpdateItemDto,
    isArray: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionsBatchUpdateItemDto)
  updateItems: QuestionsBatchUpdateItemDto[]
}
