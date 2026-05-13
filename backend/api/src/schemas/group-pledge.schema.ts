import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GroupPledgeDocument = GroupPledge & Document;

@Schema({ collection: 'group_pledges' })
export class GroupPledge {
  @Prop({ required: true, unique: true }) id!: string;
  @Prop({ required: true }) group_sale_id!: string;
  @Prop({ required: true }) user_id!: string;
  @Prop() farm_crop_id?: string;
  @Prop({ required: true }) pledged_qty_kg!: number;
}

export const GroupPledgeSchema = SchemaFactory.createForClass(GroupPledge);
// one pledge per farmer per group
GroupPledgeSchema.index({ group_sale_id: 1, user_id: 1 }, { unique: true });
