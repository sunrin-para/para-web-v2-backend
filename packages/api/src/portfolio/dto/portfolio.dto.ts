import { ApiProperty } from '@nestjs/swagger';

export class PortfolioDto {
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
    description: '포트폴리오 상세 설명',
    example: '파라 동아리 웹사이트의 프론트엔드와 백엔드를 개발했습니다...',
    required: false,
  })
  description?: string;

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
    description: '참여한 외부 멤버',
    example: ['이영희', '박민수'],
    isArray: true,
  })
  outside_member: string[];

  @ApiProperty({
    description: '프로젝트 기간',
    example: ['2024-01-01T00:00:00.000Z', '2024-12-31T00:00:00.000Z'],
    isArray: true,
  })
  date: Date[];

  @ApiProperty({
    description: '프로젝트 링크',
    example: 'https://para.sunrint.hs.kr',
    required: false,
  })
  link?: string;

  @ApiProperty({
    description: '깃허브 링크',
    example: 'https://github.com/sunrint/para',
    required: false,
  })
  github?: string;

  @ApiProperty({
    description: '썸네일 이미지 URL',
    example: 'https://example.com/thumbnail.jpg',
  })
  thumbnail: string;

  @ApiProperty({
    description: '파일 경로',
    example: '/uploads/portfolio/1/thumbnail.jpg',
  })
  filePath: string;
}
