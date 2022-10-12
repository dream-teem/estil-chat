import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';

import type { PaginationQueryDto } from '@/common/dto/pagination.dto';

import type { CreateChatMessageRequestDto } from './dto/create-chat-message.request.dto';
import type { CreateChatRequestDto } from './dto/create-chat.request.dto';
import { Chat, ChatDocument } from './schemas/chat.schema';

@Injectable()
export class ChatService {
  constructor(@InjectModel(Chat.name) private chatModel: Model<ChatDocument>) {}

  public async getAllChats(): Promise<Chat[]> {
    return this.chatModel.find().exec();
  }

  public async getChatsByUser(userId: number): Promise<Chat[]> {
    return this.chatModel.find({ 'members.userId': userId }).exec();
  }

  public async getChatMessages(chatId: string, { limit, page }: PaginationQueryDto): Promise<Chat | null> {
    return this.chatModel
      .aggregate<Chat>([
      { $match: { _id: new ObjectId(chatId) } },
      { $unwind: '$messages' },
      { $sort: { 'messages.timestamp': -1 } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
      { $group: { _id: '$_id', messages: { $push: '$messages' } } },
    ])
      .then((res: Chat[]) => res[0] || null);
  }

  public async createChat(dto: CreateChatRequestDto): Promise<Chat> {
    return this.chatModel.create(dto);
  }

  public async createChatMessage(chatId: string, dto: CreateChatMessageRequestDto): Promise<void> {
    const timestamp = new Date();
    await this.chatModel.updateOne(
      { _id: chatId, 'members.userId': 1 },
      {
        $inc: { totalMessages: 1, 'members.$.unreadCount': 1 },
        $push: {
          messages: {
            ...dto,
            timestamp,
          },
        },
        $set: {
          lastMessageText: dto.text,
          lastMessageTimestamp: timestamp,
          'members.$.lastReadTimestamp': new Date(),
          'members.$.unreadCount': 0,
        },
      },
    );
  }

  public async markRead(chatId: string, userId: number): Promise<void> {
    await this.chatModel.updateOne(
      { _id: chatId, 'members.userId': userId },
      {
        $set: {
          'members.$.lastReadTimestamp': new Date(),
          'members.$.unreadCount': 0,
        },
      },
    );
  }
}
