import { UseFilters, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket, OnGatewayConnection } from '@nestjs/websockets';
import { SentryService } from '@ntegral/nestjs-sentry';
import { parse as parseCookie } from 'cookie';

import { AuthService } from '../auth';
import { ChatEvent, ChatSocket } from './chat.interface';
import { ChatService } from './chat.service';
import { MarkMessageReadWSRequestDto } from './dto/mark-message-read.wsrequest.dto';
import type { NewChatMessageWSResponseDto } from './dto/new-chat-message.wsresponse.dto';
import { SendChatMessageWSRequestDto } from './dto/send-chat-message.wsrequest.dto';
import { TypingMessageWSRequestDto } from './dto/typing-message.wsrequest.dto';
import { WebsocketExceptionsFilter } from './filters/ws-exception.filter';
import { WsThrottlerGuard } from './guards/ws-throttler.guard';

@WebSocketGateway({ namespace: 'chat', cookie: true })
@UseFilters(WebsocketExceptionsFilter)
@UsePipes(new ValidationPipe({ transform: true }))
export class ChatGateway implements OnGatewayConnection {
  constructor(private readonly auth: AuthService, private readonly chat: ChatService, private readonly sentry: SentryService) {}

  @Throttle(5, 1)
  @UseGuards(WsThrottlerGuard)
  @SubscribeMessage(ChatEvent.SEND_MESSAGE)
  public async handleSendMessage(@MessageBody() dto: SendChatMessageWSRequestDto, @ConnectedSocket() client: ChatSocket): Promise<void> {
    const { chatId, receiverId } = dto;
    const senderId = client.user.userId;
    const message = await this.chat.createChatMessage(senderId, dto);

    const newMessage: NewChatMessageWSResponseDto = {
      chatId,
      message,
    };

    client.to(this.getUserRoom(receiverId)).emit(ChatEvent.NEW_MESSAGE, newMessage);
    client.emit(ChatEvent.MESSAGE_SENT, { id: message.id });
  }

  @Throttle(5, 1)
  @UseGuards(WsThrottlerGuard)
  @SubscribeMessage(ChatEvent.MARK_READ)
  public async handleMarkMessageRead(
    @MessageBody() { chatId, senderId }: MarkMessageReadWSRequestDto,
      @ConnectedSocket() client: ChatSocket,
  ): Promise<void> {
    const { userId } = client.user;
    const { lastReadTimestamp } = await this.chat.markRead(chatId, userId);

    const data = {
      chatId,
      userId,
      lastReadTimestamp,
    };
    client.to(this.getUserRoom(senderId)).emit(ChatEvent.MARK_READ, data);
  }

  @Throttle(5, 1)
  @UseGuards(WsThrottlerGuard)
  @SubscribeMessage(ChatEvent.TYPING_MESSAGE)
  public handleTypingMessage(
    @MessageBody() { chatId, receiverId }: TypingMessageWSRequestDto,
      @ConnectedSocket() client: ChatSocket,
  ): void {
    const { userId } = client.user;

    const data = {
      chatId,
      userId,
    };

    client.to(this.getUserRoom(receiverId)).emit(ChatEvent.TYPING_MESSAGE, data);
  }

  public async handleConnection(client: ChatSocket): Promise<void> {
    try {
      const cookies = parseCookie(client.handshake.headers.cookie || '');
      if (!cookies['token']) {
        client.disconnect();
        return;
      }

      const payload = this.auth.jwtVerify(cookies['token']);
      const userId: number | undefined = payload.sub;

      if (!userId) {
        client.disconnect();
        return;
      }

      client.user = {
        userId,
      };

      await client.join(this.getUserRoom(userId));
    } catch (err: unknown) {
      this.sentry.error(`Error while connecting to ws: ${err}`);
      client.disconnect();
    }
  }

  private getUserRoom(userId: number): string {
    return `user#${userId}`;
  }
}
