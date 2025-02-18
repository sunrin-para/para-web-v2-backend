import { ApiProperty } from '@nestjs/swagger';

export class CreateAwardsDto {
  @ApiProperty({
    description: '수상 이름',
    example: '전국 정보올림피아드 대상',
  })
  name: string;

  @ApiProperty({
    description: '수상 멤버',
    example: ['홍길동', '김철수'],
    type: [String],
    items: {
      type: 'string',
      example: '홍길동'
    }
  })
  member: string[];

  @ApiProperty({
    description: '수상 연도',
    example: 2024,
  })
  year: number;
}
