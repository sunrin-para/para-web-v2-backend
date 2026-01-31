import { ApiProperty } from '@nestjs/swagger'
import {
  IsArray,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'

export class PortfolioDto {
  @IsNumber()
  @ApiProperty({
    description: '포트폴리오 ID',
    example: 1,
  })
  id: number

  @ApiProperty({
    description: '포트폴리오 제목',
    example: '파라 웹사이트',
  })
  @IsString()
  title: string

  @ApiProperty({
    description: '포트폴리오 요약',
    example: '파라 동아리 웹사이트 제작 프로젝트',
  })
  @IsString()
  summary: string

  @ApiProperty({
    description: '포트폴리오 상세 설명',
    example: '파라 동아리 웹사이트의 프론트엔드와 백엔드를 개발했습니다...',
  })
  @IsString()
  @IsOptional()
  description?: string

  @ApiProperty({
    description: '포트폴리오 태그',
    example: [
      'React', 'NestJS', 'TypeScript',
    ],
    type: 'array',
    items: { type: 'string' },
  })
  @IsArray()
  @IsString({ each: true })
  tags: string[]

  @ApiProperty({
    description: '참여한 파라 멤버',
    example: ['홍길동', '김철수'],
    type: 'array',
    items: { type: 'string' },
  })
  @IsArray()
  @IsString({ each: true })
  para_member: string[]

  @ApiProperty({
    description: '참여한 외부 멤버',
    example: ['이영희', '박민수'],
    type: 'array',
    items: { type: 'string' },
  })
  @IsArray()
  @IsString({ each: true })
  outside_member: string[]

  @ApiProperty({
    description: '프로젝트 기간',
    example: ['2024-01-01T00:00:00.000Z', '2024-12-31T00:00:00.000Z'],
    type: 'array',
    items: { type: 'string', format: 'date' },
  })
  @IsArray()
  @IsDate({ each: true })
  date: Date[]

  @ApiProperty({
    description: '프로젝트 링크',
    example: 'https://para.sunrint.hs.kr',
    required: false,
  })
  @IsOptional()
  @IsString()
  link?: string

  @ApiProperty({
    description: '깃허브 링크',
    example: 'https://github.com/sunrint/para',
    required: false,
  })
  @IsOptional()
  @IsString()
  github?: string

  @ApiProperty({
    description: '썸네일 이미지 URL',
    example: 'https://example.com/thumbnail.jpg',
  })
  @IsString()
  thumbnail: string

  @ApiProperty({
    description: '파일 경로',
    example: 'https://sunrin-para.dev/minio/...',
  })
  @IsString()
  filePath: string

  @ApiProperty({
    description: '생성된 날짜',
    example: '2024-01-01T00:00:00.000Z',
  })
  @IsDate()
  createdAt: Date

  @ApiProperty({
    description: '수정된 날짜',
    example: '2024-01-01T00:00:00.000Z',
  })
  @IsDate()
  updatedAt: Date
}
