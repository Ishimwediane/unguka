import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SaleDocument = Sale & Document;

@Schema({ collection: 'sales' })
export class Sale {
  @Prop({ required: true, unique: true }) id!: string;
  @Prop({ required: true }) farm_crop_id!: string;
  @Prop() market_id?: string;
  @Prop() group_sale_id?: string;
  @Prop({ required: true }) qty_kg!: number;
  @Prop({ required: true }) price_per_kg_rwf!: number;
  @Prop({ required: true }) sold_on!: string;
  @Prop() used_recommendation?: boolean;
}

export const SaleSchema = SchemaFactory.createForClass(Sale);
SaleSchema.index({ farm_crop_id: 1 });
