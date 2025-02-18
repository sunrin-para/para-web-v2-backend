import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsArray,
  IsOptional,
  IsDate,
  IsDateString,
} from 'class-validator';

export class CreatePortfolioDto {
  @ApiProperty({
    description: '포트폴리오 제목',
    example: '파라 웹사이트',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: '포트폴리오 요약',
    example: '파라 동아리 웹사이트 제작 프로젝트',
  })
  @IsString()
  summary: string;

  @ApiProperty({
    description: '포트폴리오 상세 설명',
    example: '파라 동아리 웹사이트의 프론트엔드와 백엔드를 개발했습니다...',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: '포트폴리오 태그',
    example: ['React', 'NestJS', 'TypeScript'],
    isArray: true,
  })
  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @ApiProperty({
    description: '참여한 파라 멤버',
    example: ['홍길동', '김철수'],
    isArray: true,
  })
  @IsArray()
  @IsString({ each: true })
  para_member: string[];

  @ApiProperty({
    description: '참여한 외부 멤버',
    example: ['이영희', '박민수'],
    isArray: true,
  })
  @IsArray()
  @IsString({ each: true })
  outside_member: string[];

  @ApiProperty({
    description: '프로젝트 기간',
    example: ['2024-01-01T00:00:00.000Z', '2024-12-31T00:00:00.000Z'],
    isArray: true,
  })
  @IsArray()
  date: string[];

  @ApiProperty({
    description: '프로젝트 링크',
    example: 'https://para.sunrint.hs.kr',
    required: false,
  })
  @IsOptional()
  @IsString()
  link?: string;

  @ApiProperty({
    description: '깃허브 링크',
    example: 'https://github.com/para/website',
    required: false,
  })
  @IsOptional()
  @IsString()
  github?: string;

  @ApiProperty({
    description: '썸네일 이미지 URL',
    example: 'https://example.com/thumbnail.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  thumbnail?: string;

  @ApiProperty({
    description: '파일 경로',
    example: '/uploads/portfolio/123.pdf',
    required: false,
  })
  @IsOptional()
  @IsString()
  filePath?: string;
}
