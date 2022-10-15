import type { Socket } from 'socket.io';

export enum ChatEvent {
  NEW_MESSAGE = 'new-message',
  SEND_MESSAGE = 'send-message',
  MESSAGE_SENT = 'message-sent',
  MARK_READ = 'mark-read',
  TYPING_MESSAGE = 'typing-message',
}

export interface ChatUser {
  userId: number;
}

export interface ChatTokenPayload {
  userId: number;
}

export interface ChatSocket extends Socket {
  user: ChatUser;
}
