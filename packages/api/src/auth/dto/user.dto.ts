import { ApiProperty } from '@nestjs/swagger';

export class UserDataDto {
  @ApiProperty({
    description: '사용자 고유 ID',
    example: 1,
  })
  uid: number;

  @ApiProperty({
    description: '사용자 이메일',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    description: '사용자 비밀번호',
    example: 'password123',
    required: false,
  })
  password?: string;

  @ApiProperty({
    description: '사용자 이름',
    example: '홍길동',
  })
  name: string;

  @ApiProperty({
    description: '사용자 권한',
    example: 'USER',
    enum: ['SUPER', 'MODERATOR', 'MANAGER', 'USER'],
  })
  permission: string;

  @ApiProperty({
    description: '계정 생성일',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: '계정 수정일',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: '리프레시 토큰',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    required: false,
  })
  refreshToken?: string;

  @ApiProperty({
    description: '토큰 검증 키',
    example: 'a1b2c3d4e5f6g7h8i9j0',
    required: false,
  })
  validationKey?: string;
}
