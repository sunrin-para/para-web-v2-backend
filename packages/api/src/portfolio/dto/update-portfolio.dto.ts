import { ApiProperty } from '@nestjs/swagger';

export class UpdatePortfolioDto {
  @ApiProperty({ description: '포트폴리오 제목', required: false })
  title?: string;

  @ApiProperty({ description: '포트폴리오 요약', required: false })
  summary?: string;

  @ApiProperty({ description: '포트폴리오 상세 설명', required: false })
  description?: string;

  @ApiProperty({
    description: '포트폴리오 태그 목록',
    type: [String],
    required: false,
  })
  tags?: string[];

  @ApiProperty({
    description: 'PARA 멤버 목록',
    type: [String],
    required: false,
  })
  para_member?: string[];

  @ApiProperty({
    description: '외부 멤버 목록',
    type: [String],
    required: false,
  })
  outside_member?: string[];

  @ApiProperty({
    description: '포트폴리오 날짜 목록',
    type: [Date],
    required: false,
  })
  date?: Date[];

  @ApiProperty({ description: '관련 링크', required: false })
  link?: string;

  @ApiProperty({ description: 'GitHub 저장소 링크', required: false })
  github?: string;

  @ApiProperty({ description: '썸네일 이미지 URL', required: false })
  thumbnail?: string;

  @ApiProperty({ description: '파일 경로', required: false })
  filePath?: string;
}
