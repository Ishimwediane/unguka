import { IsString, Matches, IsOptional, IsIn, IsNumber } from 'class-validator';

export class RequestOtpDto {
  @IsString()
  @Matches(/^\+2507[2389]\d{7}$/, { message: 'Invalid Rwanda phone number' })
  phone_e164: string;

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

export class VerifyOtpDto {
  @IsString()
  @Matches(/^\+2507[2389]\d{7}$/, { message: 'Invalid Rwanda phone number' })
  phone_e164: string;

  @IsString()
  otp_code: string;
}
