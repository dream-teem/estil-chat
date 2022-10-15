import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { Document } from 'mongoose';
import type mongoose from 'mongoose';

export type ChatProductDocument = ChatProduct & Document<mongoose.Schema.Types.ObjectId>;

@Schema({ _id: false })
export class ChatProduct {
  @Prop({ required: true, index: true })
  productId!: number;
 
  @Prop({ required: true })
  userId!: number;

  @Prop()
  pictureUrl?: string;
}

export const ChatProductSchema = SchemaFactory.createForClass(ChatProduct);
