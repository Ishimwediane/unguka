import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GroupSaleDocument = GroupSale & Document;

@Schema({ collection: 'group_sales', timestamps: { createdAt: 'created_at', updatedAt: false } })
export class GroupSale {
  @Prop({ required: true, unique: true }) id!: string;
  @Prop() organization_id?: string;
  @Prop({ required: true }) crop_id!: string;
  @Prop({ required: true }) target_qty_kg!: number;
  @Prop() target_price_per_kg_rwf?: number;
  @Prop() collection_center?: string;
  @Prop() collection_lat?: number;
  @Prop() collection_lng?: number;
  @Prop({ required: true }) deadline_at!: Date;
  @Prop() buyer_name?: string;
  @Prop({ required: true, default: 'open', enum: ['open', 'filled', 'confirmed', 'collected', 'paid', 'cancelled'] })
  status!: string;
}

export const GroupSaleSchema = SchemaFactory.createForClass(GroupSale);
GroupSaleSchema.index({ status: 1, crop_id: 1 });
