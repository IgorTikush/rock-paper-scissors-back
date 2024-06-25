import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TransactionDocument = Transaction & Document;

@Schema()
export class Transaction {
  @Prop({ required: true })
  hash: string;

  @Prop({ required: false })
  userId: string;

  @Prop({ required: true })
  amount: string;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);