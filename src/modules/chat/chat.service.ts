import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import _ from 'lodash';
import { ObjectId } from 'mongodb';
import { FilterQuery, Model } from 'mongoose';

import type { PaginationQueryDto } from '@/common/dto/pagination.dto';

import type { CreateChatMessageRequestDto } from './dto/create-chat-message.request.dto';
import type { ChatMemberDto, CreateChatRequestDto } from './dto/create-chat.request.dto';
import type { ChatMember } from './schemas/chat-member.schema';
import type { ChatMessage } from './schemas/chat-message.schema';
import { Chat, ChatDocument } from './schemas/chat.schema';

@Injectable()
export class ChatService {
  constructor(@InjectModel(Chat.name) private chatModel: Model<ChatDocument>) {}

  public async getAllChats(): Promise<Chat[]> {
    return this.chatModel.find({}, {}, { projection: { messages: false }, sort: { lastMessageTimestamp: -1 } }).exec();
  }

  public async getChatsByUser(userId: number): Promise<Chat[]> {
    return this.chatModel
      .find({ 'members.userId': userId }, { message: false }, { projection: { messages: false }, sort: { lastMessageTimestamp: -1 } })
      .exec();
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
    const { product, members } = dto;
    const filters: FilterQuery<Chat> = {
      members: {
        $size: members.length,
        $all: members.map((member: ChatMemberDto) => ({ $elemMatch: { userId: member.userId } })),
      },
      'product.productId': product ? product.productId : { $exists: false },
    };

    return this.chatModel.findOneAndUpdate(
      filters,
      { $set: { product }, $setOnInsert: { members } },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
  }

  public async createChatMessage(chatId: string, dto: CreateChatMessageRequestDto): Promise<ChatMessage> {
    const timestamp = new Date();

    const newMessage = {
      ...dto,
      id: new ObjectId(),
      timestamp,
    };

    await this.chatModel.updateOne(
      { _id: chatId, 'members.userId': dto.userId },
      {
        $inc: { totalMessages: 1, 'members.$.unreadCount': 1 },
        $push: {
          messages: newMessage,
        },
        $set: {
          lastMessageText: dto.text,
          lastMessageTimestamp: timestamp,
        },
      },
    );

    return { ...newMessage, id: newMessage.id.toString() };
  }

  public async markRead(chatId: string, userId: number): Promise<Pick<ChatMember, 'lastReadTimestamp'>> {
    const lastReadTimestamp = new Date();
    await this.chatModel.updateOne(
      { _id: chatId, 'members.userId': userId },
      {
        $set: {
          'members.$.lastReadTimestamp': lastReadTimestamp,
          'members.$.unreadCount': 0,
        },
      },
    );

    return { lastReadTimestamp };
  }
}
