import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateMemberDto {
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
    description: '디스코드 아이디',
    example: 'example#1234',
    required: false,
  })
  @IsOptional()
  @IsString()
  discord?: string;

  @ApiProperty({
    description: '깃허브 아이디',
    example: 'github-example',
    required: false,
  })
  @IsOptional()
  @IsString()
  github?: string;

  @ApiProperty({
    description: '인스타그램 아이디',
    example: 'instagram-example',
    required: false,
  })
  @IsOptional()
  @IsString()
  instagram?: string;

  @ApiProperty({
    description: 'solved.ac 아이디',
    example: 'solvedac-example',
    required: false,
  })
  @IsOptional()
  @IsString()
  solvedac?: string;

  @ApiProperty({
    description: '이메일',
    example: 'example@example.com',
    required: false,
  })
  @IsOptional()
  @IsString()
  email?: string;
}
