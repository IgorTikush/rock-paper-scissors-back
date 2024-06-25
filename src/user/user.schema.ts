import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: false })
  lastName: string;

  @Prop({ required: true })
  tgUsername: string;

  @Prop({ required: true })
  tgId: number;

  @Prop({ required: true, default: 0 })
  balance: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
