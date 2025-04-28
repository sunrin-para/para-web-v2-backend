import { ApiProperty } from '@nestjs/swagger'
import { IsDate, IsNumber, IsString } from 'class-validator'

export class FAQDto {
  @ApiProperty({
    description: 'FAQ의 고유 ID',
    example: 1,
  })
  @IsNumber()
  id: number

  @ApiProperty({
    description: 'FAQ 질문',
    example: 'PARA는 무엇인가요?',
  })
  @IsString()
  question: string

  @ApiProperty({
    description: 'FAQ 답변',
    example: 'PARA는 선린인터넷고등학교의 프로그래밍 동아리입니다.',
  })
  @IsString()
  answer: string

  @ApiProperty({
    description: 'FAQ 생성일',
    example: '2024-01-01T00:00:00.000Z',
  })
  @IsDate()
  createdAt: Date

  @ApiProperty({
    description: 'FAQ 수정일',
    example: '2024-01-01T00:00:00.000Z',
  })
  @IsDate()
  updatedAt: Date
}
