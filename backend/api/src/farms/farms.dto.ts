import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateFarmDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  size_ha?: number;

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

export class UpdateFarmDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  size_ha?: number;

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
