import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GroupCollectionDocument = GroupCollection & Document;

@Schema({ collection: 'group_collections' })
export class GroupCollection {
  @Prop({ required: true, unique: true }) id!: string;
  @Prop({ required: true }) group_sale_id!: string;
  @Prop({ required: true }) user_id!: string;
  @Prop({ required: true }) delivered_qty_kg!: number;
  @Prop() paid_amount_rwf?: number;
  @Prop() paid_at?: Date;
}

export const GroupCollectionSchema = SchemaFactory.createForClass(GroupCollection);
GroupCollectionSchema.index({ group_sale_id: 1 });
