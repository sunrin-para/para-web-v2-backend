import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class UpdateMemberDto {
  @ApiProperty({
    description: '기수',
    example: 25,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  generation?: number;

  @ApiProperty({
    description: '이름',
    example: '홍길동',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: '학과',
    example: '소프트웨어과',
    required: false,
  })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiProperty({
    description: '전문 분야',
    example: '백엔드 개발',
    required: false,
  })
  @IsOptional()
  @IsString()
  speciality?: string;

  @ApiProperty({
    description: '자기소개',
    example: '안녕하세요. 백엔드 개발자입니다.',
    required: false,
  })
  @IsOptional()
  @IsString()
  introduction?: string;

  @ApiProperty({
    description: '프로필 이미지 URL',
    example: 'https://example.com/profile.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  profile_image?: string;

  @ApiProperty({
    description: '디스코드 아이디',
    example: 'user#1234',
    required: false,
  })
  @IsOptional()
  @IsString()
  discord?: string;

  @ApiProperty({
    description: '깃허브 아이디',
    example: 'github-user',
    required: false,
  })
  @IsOptional()
  @IsString()
  github?: string;

  @ApiProperty({
    description: '인스타그램 아이디',
    example: 'instagram-user',
    required: false,
  })
  @IsOptional()
  @IsString()
  instagram?: string;

  @ApiProperty({
    description: 'solved.ac 아이디',
    example: 'solvedac-user',
    required: false,
  })
  @IsOptional()
  @IsString()
  solvedac?: string;

  @ApiProperty({
    description: '이메일',
    example: 'user@example.com',
    required: false,
  })
  @IsOptional()
  @IsString()
  email?: string;
}
