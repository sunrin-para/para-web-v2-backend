import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @ApiProperty({
    description: '사용자 이메일',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    description: '사용자 비밀번호',
    example: 'password123',
  })
  password: string;
}
