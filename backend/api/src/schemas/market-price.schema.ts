import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MarketPriceDocument = MarketPrice & Document;

@Schema({ collection: 'market_prices' })
export class MarketPrice {
  @Prop({ required: true, unique: true }) id!: string;
  @Prop({ required: true }) market_id!: string;
  @Prop({ required: true }) crop_id!: string;
  @Prop({ required: true }) price_per_kg_rwf!: number;
  @Prop({ required: true, default: 'manual' }) source!: string;
  @Prop({ required: true, default: 1 }) source_count!: number;
  @Prop({ required: true, default: () => new Date() }) reported_at!: Date;
}

export const MarketPriceSchema = SchemaFactory.createForClass(MarketPrice);
MarketPriceSchema.index({ crop_id: 1, market_id: 1, reported_at: -1 });
