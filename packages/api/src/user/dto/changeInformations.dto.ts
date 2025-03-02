import { ApiProperty } from '@nestjs/swagger';
import { Permission } from '@/common/enums/Permission.enum';

export class ChangePasswordDto {
  @ApiProperty({
    description: '사용자 이메일',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    description: '새로운 비밀번호',
    example: 'newPassword123',
  })
  newPassword: string;
}

export class ChangePermissionDto {
  @ApiProperty({
    description: '사용자 이메일',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    description: '새로운 권한',
    example: Permission.USER,
    enum: Permission,
  })
  newPermission: Permission;
}
