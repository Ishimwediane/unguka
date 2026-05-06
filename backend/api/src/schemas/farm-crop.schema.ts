import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FarmCropDocument = FarmCrop & Document;

@Schema({ collection: 'farm_crops' })
export class FarmCrop {
  @Prop({ required: true, unique: true })
  id!: string;

  @Prop({ required: true })
  farm_id!: string;

  @Prop({ required: true })
  crop_id!: string;

  @Prop()
  season_label?: string;

  @Prop()
  planted_at?: string;

  @Prop()
  expected_harvest_at?: string;

  @Prop()
  expected_qty_kg?: string;

  @Prop({ required: true, default: 'planted', enum: ['planted', 'growing', 'near_harvest', 'harvested', 'closed'] })
  status!: string;
}

export const FarmCropSchema = SchemaFactory.createForClass(FarmCrop);
FarmCropSchema.index({ farm_id: 1 });
