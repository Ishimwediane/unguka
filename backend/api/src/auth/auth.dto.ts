import { IsString, Matches } from 'class-validator';

export class RequestOtpDto {
  @IsString()
  @Matches(/^\+2507[2389]\d{7}$/, { message: 'Invalid Rwanda phone number' })
  phone_e164: string;
}

export class VerifyOtpDto {
  @IsString()
  @Matches(/^\+2507[2389]\d{7}$/, { message: 'Invalid Rwanda phone number' })
  phone_e164: string;

  @IsString()
  otp_code: string;
}
