import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MarketDocument = Market & Document;

@Schema({ collection: 'markets' })
export class Market {
  @Prop({ required: true, unique: true }) id!: string;
  @Prop({ required: true }) name!: string;
  @Prop() district?: string;
  @Prop() sector?: string;
  @Prop() gps_lat?: number;
  @Prop() gps_lng?: number;
}

export const MarketSchema = SchemaFactory.createForClass(Market);
