import { IsString, Matches, IsOptional, IsIn, IsNumber, MinLength } from 'class-validator';

export class SignupDto {
  @IsString()
  @Matches(/^\+2507[2389]\d{7}$/, { message: 'Invalid Rwanda phone number' })
  phone_e164!: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password!: string;

  @IsString()
  @IsIn(['farmer', 'coop_manager', 'ngo_user'])
  role!: string;

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
}

export class LoginDto {
  @IsString()
  @Matches(/^\+2507[2389]\d{7}$/, { message: 'Invalid Rwanda phone number' })
  phone_e164!: string;

  @IsString()
  password!: string;
}
