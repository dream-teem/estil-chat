import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { Document } from 'mongoose';
import mongoose from 'mongoose';
import { SchemaName } from '@/common/interfaces/schema';
import { BaseSchema } from '@/common/base.schema';

export type ChatMessageDocument = ChatMessage & Document;

@Schema({ collection: SchemaName.CHAT_MESSAGE, })
export class ChatMessage extends BaseSchema{

  @Prop({ required: true })
  userId!: number;

  @Prop({ required: true, index: true, type: mongoose.Schema.Types.ObjectId })
  chatId!: string;

  @Prop({ required: true })
  text!: string;

  @Prop({ index: true, type: Date, default: () => new Date() })
  timestamp!: Date;
}

export const ChatMessageSchema = SchemaFactory.createForClass(ChatMessage);
