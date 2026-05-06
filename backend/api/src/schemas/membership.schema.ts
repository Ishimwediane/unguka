import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MembershipDocument = Membership & Document;

@Schema({ collection: 'memberships', timestamps: { createdAt: 'joined_at', updatedAt: false } })
export class Membership {
  @Prop({ required: true, unique: true })
  id!: string;

  @Prop({ required: true })
  user_id!: string;

  @Prop({ required: true })
  organization_id!: string;

  @Prop({ required: true, enum: ['member', 'manager', 'viewer'] })
  role_in_org!: string;
}

export const MembershipSchema = SchemaFactory.createForClass(Membership);
MembershipSchema.index({ user_id: 1, organization_id: 1 }, { unique: true });
