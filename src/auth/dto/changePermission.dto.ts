import { Permission } from 'src/common/enums/Permission.enum';

export class ChangePermissionDto {
  email: string;
  newPermission: Permission;
}
