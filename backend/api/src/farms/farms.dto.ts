import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateFarmDto {
  @ApiPropertyOptional({ example: 'My Main Farm' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 2.5 })
  @IsOptional()
  @IsNumber()
  size_ha?: number;

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

export class UpdateFarmDto {
  @ApiPropertyOptional({ example: 'Updated Farm Name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 3.0 })
  @IsOptional()
  @IsNumber()
  size_ha?: number;

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
