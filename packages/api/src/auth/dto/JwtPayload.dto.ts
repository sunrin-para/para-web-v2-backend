import { Permission as PermissionEnum } from '@/common/enums/Permission.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class JwtPayload {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: '사용자 고유 ID',
    example: 1,
  })
  uid: number;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: '사용자 이메일',
    example: 'user@example.com',
  })
  email: string;

  @IsEnum(PermissionEnum)
  @IsNotEmpty()
  @ApiProperty({
    description: '사용자 권한',
    example: 'USER',
    enum: ['SUPER', 'MODERATOR', 'MANAGER', 'USER'],
    items: { type: 'string' },
  })
  permission: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: '토큰 검증 키',
    example: 'a1b2c3d4e5f6g7h8i9j0',
  })
  validationKey: string;
}
