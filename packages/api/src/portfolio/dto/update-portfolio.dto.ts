import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsDate, IsOptional, IsString } from 'class-validator'

export class UpdatePortfolioDto {
  @ApiProperty({ description: '포트폴리오 제목', required: false })
  @IsString()
  @IsOptional()
  title?: string

  @ApiProperty({ description: '포트폴리오 요약', required: false })
  @IsString()
  @IsOptional()
  summary?: string

  @ApiProperty({ description: '포트폴리오 상세 설명', required: false })
  @IsString()
  @IsOptional()
  description?: string

  @ApiProperty({
    description: '포트폴리오 태그 목록',
    example: ['React', 'NestJs'],
    type: 'array',
    items: { type: 'string' },
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[]

  @ApiProperty({
    description: 'PARA 멤버 목록',
    example: ['홍길동', '김철수'],
    type: 'array',
    items: { type: 'string' },
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  para_member?: string[]

  @ApiProperty({
    description: '외부 멤버 목록',
    example: ['이영희', '박민수'],
    type: 'array',
    items: { type: 'string' },
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  outside_member?: string[]

  @ApiProperty({
    description: '포트폴리오 날짜 목록',
    example: ['2024-01-01T00:00:00.000Z', '2024-12-31T00:00:00.000Z'],
    type: 'array',
    items: { type: 'string', format: 'date' },
    required: false,
  })
  @IsArray()
  @IsDate({ each: true })
  @IsOptional()
  date?: Date[]

  @ApiProperty({ description: '관련 링크', required: false })
  @IsString()
  @IsOptional()
  link?: string

  @ApiProperty({ description: 'GitHub 저장소 링크', required: false })
  @IsString()
  @IsOptional()
  github?: string

  @ApiProperty({ description: '썸네일 이미지 URL', required: false })
  @IsString()
  @IsOptional()
  thumbnail?: string

  @ApiProperty({ description: '파일 경로', required: false })
  @IsString()
  @IsOptional()
  filePath?: string
}
