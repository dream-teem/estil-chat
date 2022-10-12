import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
export class ChatMember extends Document {
  @Prop({ required: true, index: true })
  userId!: number;

  @Prop()
  username?: string;

  @Prop()
  pictureUrl?: string;

  @Prop()
  lastReadTimestamp?: Date;

  @Prop({ type: Number, default: 0 })
  unreadCount?: number;
}

export const ChatMemberSchema = SchemaFactory.createForClass(ChatMember);
