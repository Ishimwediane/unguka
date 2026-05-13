import { IsString, IsNumber, IsOptional, IsDateString, IsEnum } from 'class-validator';

export class CreateGroupDto {
  @IsString() crop_id!: string;
  @IsNumber() target_qty_kg!: number;
  @IsOptional() @IsNumber() target_price_per_kg_rwf?: number;
  @IsOptional() @IsString() collection_center?: string;
  @IsOptional() @IsNumber() collection_lat?: number;
  @IsOptional() @IsNumber() collection_lng?: number;
  @IsDateString() deadline_at!: string;
  @IsOptional() @IsString() buyer_name?: string;
}

export class CreatePledgeDto {
  @IsNumber() pledged_qty_kg!: number;
  @IsOptional() @IsString() farm_crop_id?: string;
}

export class UpdatePledgeDto {
  @IsNumber() pledged_qty_kg!: number;
}

export class CreateCollectionDto {
  @IsString() user_id!: string;
  @IsNumber() delivered_qty_kg!: number;
  @IsOptional() @IsNumber() paid_amount_rwf?: number;
}

export class TransitionDto {
  @IsEnum(['filled', 'confirmed', 'collected', 'paid', 'cancelled'])
  status!: string;
}
