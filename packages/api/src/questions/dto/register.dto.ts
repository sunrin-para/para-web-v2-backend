import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class CreateFAQDto {
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
}
