import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put, Query, ValidationPipe } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { PaginationQueryDto } from '@/common/dto/pagination.query.dto';

import { ChatService } from './chat.service';
import { CreateChatRequestDto } from './dto/create-chat.request.dto';
import type { ChatMember } from './schemas/chat-member.schema';
import { Chat } from './schemas/chat.schema';

@ApiTags('Chats')
@Controller('chats')
export class ChatController {
  constructor(private readonly chat: ChatService) {}

  @ApiOperation({ description: 'Get chats' })
  @ApiOkResponse({ type: Chat, isArray: true })
  @Get('all')
  public async getAllChats(): Promise<Chat[]> {
    return this.chat.getAllChats();
  }

  // TODO: create product response dto for swagger
  @ApiOperation({ description: 'Get chats' })
  @ApiOkResponse({ type: Chat, isArray: true })
  @Get('user/:userId')
  public async getChatsByUser(@Param('userId') userId: number): Promise<Chat[]> {
    return this.chat.getChatsByUser(userId);
  }

  // TODO: create product response dto for swagger
  @ApiOperation({ description: 'Get chat messages' })
  @ApiOkResponse({ type: Chat, isArray: true })
  @Get(':chatId/messages')
  public async getChatsMessages(
    @Param('chatId') chatId: string,
      @Query(new ValidationPipe({ transform: true, transformOptions: { enableImplicitConversion: true } })) pagination: PaginationQueryDto,
  ): Promise<Chat | null> {
    return this.chat.getChatMessages(chatId, pagination);
  }

  // TODO: create product response dto for swagger
  @ApiOperation({ description: 'Create Chat' })
  @ApiBadRequestResponse()
  @ApiInternalServerErrorResponse()
  @ApiCreatedResponse({ type: Chat })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  public async createChat(@Body() dto: CreateChatRequestDto): Promise<Chat> {
    return this.chat.createChat(dto);
  }

  @ApiOperation({ description: 'Mark Chat Read' })
  @ApiBadRequestResponse()
  @ApiInternalServerErrorResponse()
  @Put(':chatId/read')
  @HttpCode(HttpStatus.OK)
  public async markChatRead(@Param('chatId') chatId: string): Promise<Pick<ChatMember, 'lastReadTimestamp'>> {
    return this.chat.markRead(chatId, 1);
  }
}
