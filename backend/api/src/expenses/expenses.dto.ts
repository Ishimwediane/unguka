import { IsString, IsNumber, IsOptional, IsEnum } from 'class-validator';

export class CreateExpenseDto {
  @IsEnum(['seeds', 'labor', 'fertilizer', 'pesticides', 'transport', 'other'])
  category!: string;

  @IsNumber()
  amount_rwf!: number;

  @IsString()
  occurred_on!: string;

  @IsOptional() @IsString()
  note?: string;

  @IsOptional() @IsString()
  receipt_url?: string;
}
