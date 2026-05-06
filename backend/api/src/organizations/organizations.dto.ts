import { IsString, IsOptional, IsIn } from 'class-validator';

export class CreateOrganizationDto {
  @IsIn(['cooperative', 'ngo'])
  type!: string;

  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  region?: string;

  @IsOptional()
  @IsString()
  contact_phone?: string;
}

export class UpdateOrganizationDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  region?: string;

  @IsOptional()
  @IsString()
  contact_phone?: string;
}
