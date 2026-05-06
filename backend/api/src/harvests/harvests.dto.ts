import { IsString, IsNumber, IsOptional, IsEnum } from 'class-validator';

export class CreateHarvestDto {
  @IsNumber()
  qty_kg!: number;

  @IsString()
  harvested_on!: string;

  @IsOptional() @IsEnum(['A', 'B', 'C'])
  quality_grade?: string;
}
