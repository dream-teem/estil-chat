import { BaseSchema } from '@/common/base.schema';
import { SchemaName } from '@/common/interfaces/schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { Document } from 'mongoose';
import type mongoose from 'mongoose';
import { ChatMember, ChatMemberSchema } from './chat-member.schema';
import { ChatMessage, ChatMessageSchema } from './chat-message.schema';

export type ChatDocument = Chat & Document<mongoose.Schema.Types.ObjectId>;

@Schema({
  timestamps: true,
  collection: SchemaName.CHAT,
})
export class Chat extends BaseSchema {
  @Prop({ type: [ChatMemberSchema], default: [] })
  members!: ChatMember[];

  @Prop({ type: [ChatMessageSchema], default: [] })
  messages!: ChatMessage[];

  @Prop({ index: true })
  lastMessageTimestamp?: string;

  @Prop()
  lastMessageText?: string;

  @Prop({default: 0, type: Number})
  totalMessages!: number;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
