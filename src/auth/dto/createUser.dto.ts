import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  email: string;
  password?: string;
  name: string;
  permission?: string;
}
