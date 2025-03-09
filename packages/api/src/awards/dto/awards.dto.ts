import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDate, IsNumber, IsString } from 'class-validator';

export class AwardsDto {
  @ApiProperty({
    description: '실적 Id',
    example: 1,
  })
  @IsNumber()
  id: number;

  @ApiProperty({
    description: '수상 이름',
    example: '전국 정보올림피아드 대상',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: '수상 멤버',
    example: ['홍길동', '김철수'],
    items: { type: 'string' },
  })
  @IsArray()
  @IsString({ each: true })
  member: string[];

  @ApiProperty({
    description: '수상 연도',
    example: 2024,
  })
  @IsNumber()
  year: number;

  @ApiProperty({
    description: '수상 기록 생성일',
    example: '2023-01-01T00:00:00.000Z',
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    description: '수상 기록 수정일',
    example: '2023-01-01T00:00:00.000Z',
  })
  @IsDate()
  updatedAt: Date;
}
