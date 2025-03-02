import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: '사용자 이메일',
    example: 'user@example.com',
  })
  email: string;
  @ApiProperty({
    description: '사용자 비밀번호 (선택)',
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
    description: '사용자 권한 (선택)',
    example: 'USER',
    enum: ['SUPER', 'MODERATOR', 'MANAGER', 'USER'],
    required: false,
  })
  permission?: string;
}
