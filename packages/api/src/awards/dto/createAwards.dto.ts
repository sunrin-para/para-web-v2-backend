import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsNumber, IsString } from 'class-validator'

export class CreateAwardsDto {
  @ApiProperty({
    description: '수상 이름',
    example: '전국 정보올림피아드 대상',
  })
  @IsString()
  name: string

  @ApiProperty({
    description: '수상 멤버',
    example: ['홍길동', '김철수'],
    items: {
      type: 'string',
      example: '홍길동',
    },
  })
  @IsArray()
  @IsString({ each: true })
  member: string[]

  @ApiProperty({
    description: '수상 연도',
    example: 2024,
  })
  @IsNumber()
  year: number
}
