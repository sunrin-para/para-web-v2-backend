import { ApiProperty } from '@nestjs/swagger';

export class JwtPayload {
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
    description: '사용자 권한',
    example: 'USER',
    enum: ['SUPER', 'MODERATOR', 'MANAGER', 'USER'],
  })
  permission: string;

  @ApiProperty({
    description: '토큰 검증 키',
    example: 'a1b2c3d4e5f6g7h8i9j0',
  })
  validationKey: string;
}
