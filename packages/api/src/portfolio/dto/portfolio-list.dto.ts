import { ApiProperty } from '@nestjs/swagger';

export class MonoPortfolioList {
  @ApiProperty({
    description: '포트폴리오 고유 ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: '포트폴리오 제목',
    example: '파라 웹사이트',
  })
  title: string;

  @ApiProperty({
    description: '포트폴리오 요약',
    example: '파라 동아리 웹사이트 제작 프로젝트',
  })
  summary: string;

  @ApiProperty({
    description: '포트폴리오 태그',
    example: ['React', 'NestJS', 'TypeScript'],
    isArray: true,
  })
  tags: string[];

  @ApiProperty({
    description: '참여한 파라 멤버',
    example: ['홍길동', '김철수'],
    isArray: true,
  })
  para_member: string[];

  @ApiProperty({
    description: '썸네일 이미지 URL',
    example: 'https://example.com/thumbnail.jpg',
  })
  thumbnail: string;
}
