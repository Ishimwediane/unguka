import { IsString, IsOptional, IsIn, IsMobilePhone, IsNumber } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsMobilePhone()
  phone_e164!: string;

  @IsOptional()
  @IsString()
  full_name?: string;

  @IsOptional()
  @IsIn(['rw', 'en', 'fr'])
  language?: string;

  @IsOptional()
  @IsString()
  district?: string;

  @IsOptional()
  @IsString()
  sector?: string;

  @IsOptional()
  @IsNumber()
  gps_lat?: number;

  @IsOptional()
  @IsNumber()
  gps_lng?: number;

  @IsOptional()
  @IsIn(['farmer', 'coop_manager', 'ngo_user', 'admin'])
  role?: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  full_name?: string;

  @IsOptional()
  @IsIn(['rw', 'en', 'fr'])
  language?: string;

  @IsOptional()
  @IsString()
  district?: string;

  @IsOptional()
  @IsString()
  sector?: string;

  @IsOptional()
  @IsNumber()
  gps_lat?: number;

  @IsOptional()
  @IsNumber()
  gps_lng?: number;

  @IsOptional()
  @IsIn(['farmer', 'coop_manager', 'ngo_user', 'admin'])
  role?: string;
}
