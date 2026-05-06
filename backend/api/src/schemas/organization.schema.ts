import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrganizationDocument = Organization & Document;

@Schema({ collection: 'organizations', timestamps: { createdAt: 'created_at', updatedAt: false } })
export class Organization {
  @Prop({ required: true, unique: true })
  id!: string;

  @Prop({ required: true, enum: ['cooperative', 'ngo'] })
  type!: string;

  @Prop({ required: true })
  name!: string;

  @Prop()
  region?: string;

  @Prop()
  contact_phone?: string;
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);
