import { ApiProperty } from '@nestjs/swagger';

export class DeleteAccountDto {
  @ApiProperty({
    description: '삭제할 계정의 이메일',
    example: 'user@example.com',
  })
  email: string;
}
