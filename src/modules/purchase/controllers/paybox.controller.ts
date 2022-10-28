import { Controller, Post, Req } from '@nestjs/common';
import { SentryService } from '@ntegral/nestjs-sentry';
import type { Request } from 'express';

import type { PayboxResultRequestDto } from '../dto/paybox-result.request.dto';
import { PayboxWebhookHandlerService } from '../services/paybox-webhook-handler.service';

@Controller('paybox')
export class PayboxController {
  constructor(private readonly webhookHandler: PayboxWebhookHandlerService, private readonly sentry: SentryService) {}

  @Post('webhook')
  public async purchaseProduct(@Req() req: Request): Promise<void> {
    return this.webhookHandler
      .handlePayboxWebhook(req.url, <PayboxResultRequestDto>req.body)
      .catch((err: unknown) => {
        this.sentry.debug(`Error handling webhook: ${err}`);
        this.sentry.instance().captureException(err);
      });
  }
}
