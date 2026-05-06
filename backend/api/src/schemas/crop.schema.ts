import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CropDocument = Crop & Document;

@Schema({ collection: 'crops' })
export class Crop {
  @Prop({ required: true, unique: true })
  id!: string;

  @Prop({ required: true })
  name_rw!: string;

  @Prop({ required: true })
  name_en!: string;

  @Prop({ required: true, default: 'kg' })
  unit!: string;

  @Prop()
  typical_cycle_days: number;
}

export const CropSchema = SchemaFactory.createForClass(Crop);
