import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class MemberDto {
  @ApiProperty({
    description: '멤버 고유 ID',
    example: 1,
  })
  id?: number;

  @ApiProperty({
    description: '생성일',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt?: Date;

  @ApiProperty({
    description: '수정일',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt?: Date;

  @ApiProperty({
    description: '기수',
    example: 25,
  })
  @IsString()
  generation: number;

  @ApiProperty({
    description: '이름',
    example: '홍길동',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: '학과',
    example: '소프트웨어과',
  })
  @IsString()
  department: string;

  @ApiProperty({
    description: '전문 분야',
    example: '백엔드 개발',
  })
  @IsString()
  speciality: string;

  @ApiProperty({
    description: '자기소개',
    example: '안녕하세요. 백엔드 개발자 홍길동입니다.',
  })
  @IsString()
  introduction: string;

  @ApiProperty({
    description: '프로필 이미지 URL',
    example: 'https://example.com/profile.jpg',
  })
  @IsOptional()
  @IsString()
  profile_image?: string;

  @ApiProperty({
    description: '디스코드 아이디',
    example: 'example#1234',
  })
  @IsOptional()
  @IsString()
  discord?: string;

  @ApiProperty({
    description: '깃허브 아이디',
    example: 'github-example',
  })
  @IsOptional()
  @IsString()
  github?: string;

  @ApiProperty({
    description: '인스타그램 아이디',
    example: 'instagram-example',
  })
  @IsOptional()
  @IsString()
  instagram?: string;

  @ApiProperty({
    description: 'solved.ac 아이디',
    example: 'solvedac-example',
  })
  @IsOptional()
  @IsString()
  solvedac?: string;

  @ApiProperty({
    description: '이메일',
    example: 'example@example.com',
  })
  @IsOptional()
  @IsString()
  email?: string;
}
