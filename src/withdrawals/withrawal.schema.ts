import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type WithdrawalDocument = Withdrawal & Document;

@Schema()
export class Withdrawal {
  @Prop({ required: true })
  amount: number;

  @Prop({ required: false })
  commission: number;

  @Prop({ required: true })
  user: string;

  @Prop({ required: true })
  wallet: string;
}

export const WithdrawalSchema = SchemaFactory.createForClass(Withdrawal);
