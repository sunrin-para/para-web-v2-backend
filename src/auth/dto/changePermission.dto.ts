import { Permission } from 'src/common/enums/Permission.enum';
import { ApiProperty } from '@nestjs/swagger';

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
