import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { Document } from 'mongoose';
import type mongoose from 'mongoose';
import { ObjectId } from 'mongodb';

export type ChatMessageDocument = ChatMessage & Document<mongoose.Schema.Types.ObjectId>;

@Schema({ _id: false })
export class ChatMessage {
  @Prop({ index: true, default: () => new ObjectId() })
  id!: string;

  @Prop({ required: true })
  userId!: number;

  @Prop({ required: true })
  text!: string;

  @Prop({ index: true, type: Date, default: () => new Date() })
  timestamp!: Date;
}

export const ChatMessageSchema = SchemaFactory.createForClass(ChatMessage);
