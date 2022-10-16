/* eslint-disable */
// @ts-nocheck
import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import { ThrottlerException } from '@nestjs/throttler';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';
import { SentryService } from '@ntegral/nestjs-sentry';

import type { ChatSocket } from '../chat.interface';

@Catch()
export class WebsocketExceptionsFilter {
  constructor(private readonly sentry: SentryService) {}

  public override catch(exception: any, host: ArgumentsHost): void {
    const client = host.switchToWs().getClient<ChatSocket>();

    const isWsException = exception instanceof WsException;
    const isHttpException = exception instanceof HttpException;
    const isThrottlerException = exception instanceof ThrottlerException;

    const error = exception?.getError?.() || exception?.getResponse?.() || exception;

    const message = error instanceof Object ? { ...error } : { message: error };

    if (!isWsException && !isHttpException && !isThrottlerException) {
      this.sentry.instance().captureException(exception, { user: { id: client.user.userId } });
      this.sentry.log(exception)
      client.emit('exception', { status: 'error', message: 'Internal server error' });
    } else {
      client.emit('exception', { status: 'error', ...message });
    }
  }
}
