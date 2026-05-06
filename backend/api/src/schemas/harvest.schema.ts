import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type HarvestDocument = Harvest & Document;

@Schema({ collection: 'harvests' })
export class Harvest {
  @Prop({ required: true, unique: true }) id!: string;
  @Prop({ required: true }) farm_crop_id!: string;
  @Prop({ required: true }) qty_kg!: number;
  @Prop({ required: true }) harvested_on!: string;
  @Prop({ enum: ['A', 'B', 'C'] }) quality_grade?: string;
}

export const HarvestSchema = SchemaFactory.createForClass(Harvest);
HarvestSchema.index({ farm_crop_id: 1 });
