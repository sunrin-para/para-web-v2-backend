import { IsString, IsOptional } from 'class-validator';

export class MemberDto {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  @IsString()
  generation: number;

  @IsString()
  name: string;

  @IsString()
  department: string;

  @IsString()
  speciality: string;

  @IsString()
  introduction: string;

  @IsOptional()
  @IsString()
  profile_image?: string;

  @IsOptional()
  @IsString()
  discord?: string;

  @IsOptional()
  @IsString()
  github?: string;

  @IsOptional()
  @IsString()
  instagram?: string;

  @IsOptional()
  @IsString()
  solvedac?: string;

  @IsOptional()
  @IsString()
  email?: string;
}
