import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { Document } from 'mongoose';
import type mongoose from 'mongoose';

export type ChatMessageDocument = ChatMember & Document<mongoose.Schema.Types.ObjectId>;

@Schema({ _id: false })
export class ChatMember {
  @Prop({ required: true, index: true })
  userId!: number;

  @Prop()
  username?: string;

  @Prop()
  pictureUrl?: string;

  @Prop({ type: Date, default: () => new Date() })
  lastReadTimestamp!: Date;

  @Prop({ type: Number, default: 0 })
  unreadCount!: number;
}

export const ChatMemberSchema = SchemaFactory.createForClass(ChatMember);
