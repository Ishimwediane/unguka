import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FarmDocument = Farm & Document;

@Schema({ collection: 'farms' })
export class Farm {
  @Prop({ required: true, unique: true })
  id!: string;

  @Prop({ required: true })
  user_id!: string;

  @Prop()
  name?: string;

  @Prop()
  size_ha?: number;

  @Prop()
  district?: string;

  @Prop()
  sector?: string;

  @Prop()
  gps_lat?: number;

  @Prop()
  gps_lng?: number;

  @Prop()
  archived_at?: Date;
}

export const FarmSchema = SchemaFactory.createForClass(Farm);
FarmSchema.index({ user_id: 1 });
