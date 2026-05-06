import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, Matches, IsOptional, IsIn, IsNumber, MinLength } from 'class-validator';

export class SignupDto {
  @ApiProperty({ example: '+250781234567' })
  @IsString()
  @Matches(/^\+2507[2389]\d{7}$/, { message: 'Invalid Rwanda phone number' })
  phone_e164!: string;

  @ApiProperty({ example: 'mypassword123', minLength: 6 })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password!: string;

  @ApiProperty({ enum: ['farmer', 'coop_manager', 'ngo_user'], example: 'farmer' })
  @IsString()
  @IsIn(['farmer', 'coop_manager', 'ngo_user'])
  role!: string;

  @ApiPropertyOptional({ example: 'John Doe' })
  @IsOptional()
  @IsString()
  full_name?: string;

  @ApiPropertyOptional({ enum: ['rw', 'en', 'fr'], default: 'rw' })
  @IsOptional()
  @IsIn(['rw', 'en', 'fr'])
  language?: string;

  @ApiPropertyOptional({ example: 'Gasabo' })
  @IsOptional()
  @IsString()
  district?: string;

  @ApiPropertyOptional({ example: 'Bumbogo' })
  @IsOptional()
  @IsString()
  sector?: string;

  @ApiPropertyOptional({ example: -1.9441 })
  @IsOptional()
  @IsNumber()
  gps_lat?: number;

  @ApiPropertyOptional({ example: 30.0619 })
  @IsOptional()
  @IsNumber()
  gps_lng?: number;
}

export class LoginDto {
  @ApiProperty({ example: '+250781234567' })
  @IsString()
  @Matches(/^\+2507[2389]\d{7}$/, { message: 'Invalid Rwanda phone number' })
  phone_e164!: string;

  @ApiProperty({ example: 'mypassword123' })
  @IsString()
  password!: string;
}
