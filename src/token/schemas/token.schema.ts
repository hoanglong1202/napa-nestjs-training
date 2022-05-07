import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type TokenDocument = Token & mongoose.Document;

@Schema()
export class Token {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  })
  userId: string;

  @Prop({ required: true })
  token: string;

  @Prop({ default: Date.now, expires: 3600 })
  createdAt: Date;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
