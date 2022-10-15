import { Injectable, type ExecutionContext } from '@nestjs/common';
import { ThrottlerException, ThrottlerGuard } from '@nestjs/throttler';

import type { ChatSocket } from '../chat.interface';

@Injectable()
export class WsThrottlerGuard extends ThrottlerGuard {
  public override async handleRequest(context: ExecutionContext, limit: number, ttl: number): Promise<boolean> {
    const client = context.switchToWs().getClient<ChatSocket>();
    const ip = client.conn.remoteAddress;
    const key = this.generateKey(context, ip);
    const ttls = await this.storageService.getRecord(key);

    if (ttls.length >= limit) {
      throw new ThrottlerException();
    }

    await this.storageService.addRecord(key, ttl);
    return true;
  }

  public override generateKey(context: ExecutionContext, ip: string): string {
    const client = context.switchToWs().getClient<ChatSocket>();

    const user = client.user.userId;
    if (user) return `${ip}-${user}`;

    return ip;
  }
}
