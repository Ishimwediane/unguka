import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ collection: 'users', timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class User {
  @Prop({ required: true, unique: true })
  id!: string;

  @Prop({ required: true, unique: true })
  phone_e164!: string;

  @Prop()
  password?: string;

  @Prop()
  full_name?: string;

  @Prop({ required: true, default: 'rw', enum: ['rw', 'en', 'fr'] })
  language!: string;

  @Prop()
  district?: string;

  @Prop()
  sector?: string;

  @Prop()
  gps_lat?: number;

  @Prop()
  gps_lng?: number;

  @Prop({ required: true, default: 'farmer', enum: ['farmer', 'coop_manager', 'ngo_user', 'admin'] })
  role!: string;

  @Prop()
  otp_code?: string;

  @Prop()
  otp_expires_at?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
