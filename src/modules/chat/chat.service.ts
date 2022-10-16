import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

import type { PaginationQueryDto } from '@/common/dto/pagination.dto';

import type { CreateChatMessageRequestDto } from './dto/create-chat-message.request.dto';
import type { ChatMemberDto, CreateChatRequestDto } from './dto/create-chat.request.dto';
import type { ChatMember } from './schemas/chat-member.schema';
import { ChatMessage, ChatMessageDocument } from './schemas/chat-message.schema';
import { Chat, ChatDocument } from './schemas/chat.schema';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat.name) private chatModel: Model<ChatDocument>,
    @InjectModel(ChatMessage.name) private chatMessageModel: Model<ChatMessageDocument>,
  ) {}

  public async getAllChats(): Promise<Chat[]> {
    return this.chatModel.find({}, {}, { projection: { messages: false }, sort: { lastMessageTimestamp: -1 } }).exec();
  }

  public async getChatsByUser(userId: number): Promise<Chat[]> {
    return this.chatModel
      .find({ 'members.userId': userId }, { message: false }, { projection: { messages: false }, sort: { lastMessageTimestamp: -1 } })
      .exec();
  }

  public async getChatMessages(chatId: string, { limit, page }: PaginationQueryDto): Promise<ChatMessage[]> {
    return this.chatMessageModel.find({ chatId }, {}, { sort: { timestamp: -1 }, limit, skip: (page - 1) * limit }).exec();
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
    const timestamp = new Date().toISOString();

    return this.chatMessageModel.create({
      ...dto,
      chatId,
      timestamp,
    });
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
