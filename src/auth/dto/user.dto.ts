export class UserDataDto {
  uid: number;
  email: string;
  password?: string;
  name: string;
  permission: string;
  createdAt: Date;
  updatedAt: Date;
  refreshToken?: string;
  validationKey?: string;
}
