import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ExpenseDocument = Expense & Document;

@Schema({ collection: 'expenses', timestamps: { createdAt: 'created_at', updatedAt: false } })
export class Expense {
  @Prop({ required: true, unique: true }) id!: string;
  @Prop({ required: true }) farm_crop_id!: string;
  @Prop({ required: true, enum: ['seeds', 'labor', 'fertilizer', 'pesticides', 'transport', 'other'] }) category!: string;
  @Prop({ required: true }) amount_rwf!: number;
  @Prop({ required: true }) occurred_on!: string;
  @Prop() note?: string;
  @Prop() receipt_url?: string;
  @Prop() created_by?: string;
}

export const ExpenseSchema = SchemaFactory.createForClass(Expense);
ExpenseSchema.index({ farm_crop_id: 1, occurred_on: -1 });
