import { IsString, IsOptional, IsNumber } from 'class-validator';

export class UpdateMemberDto {
  @IsOptional()
  @IsNumber()
  generation?: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  department?: string;

  @IsOptional()
  @IsString()
  speciality?: string;

  @IsOptional()
  @IsString()
  introduction?: string;

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
