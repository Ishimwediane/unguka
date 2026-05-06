import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class CreateSaleDto {
  @IsString()
  farm_crop_id!: string;

  @IsOptional() @IsString()
  market_id?: string;

  @IsOptional() @IsString()
  group_sale_id?: string;

  @IsNumber()
  qty_kg!: number;

  @IsNumber()
  price_per_kg_rwf!: number;

  @IsString()
  sold_on!: string;

  @IsOptional() @IsBoolean()
  used_recommendation?: boolean;
}
