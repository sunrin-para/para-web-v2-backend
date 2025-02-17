import { ApiProperty } from '@nestjs/swagger';

export class GoogleUserDto {
  @ApiProperty({
    description: '구글 계정 이메일',
    example: 'user@gmail.com',
  })
  email: string;
  @ApiProperty({
    description: '구글 계정 이름',
    example: '홍길동',
  })
  name: string;
}
