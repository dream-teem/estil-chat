import { Controller, Post, Req } from '@nestjs/common';
import { SentryService } from '@ntegral/nestjs-sentry';
import type { Request } from 'express';

import { PayboxWebhookType } from '../interfaces/paybox-webhook.interface';
import { PayboxWebhookHandlerService } from '../services/paybox-webhook-handler.service';

@Controller('paybox')
export class PayboxController {
  constructor(private readonly webhookHandler: PayboxWebhookHandlerService, private readonly sentry: SentryService) {}

  @Post(`webhook/${PayboxWebhookType.CHARGE}`)
  public async purchaseProduct(@Req() req: Request): Promise<string> {
    return this.webhookHandler.handlePayboxWebhook({ type: PayboxWebhookType.CHARGE, data: req.body }).catch((err: unknown) => {
      this.sentry.debug(`Error handling charge webhook: ${err}`);
      this.sentry.instance().captureException(err);
      throw err;
    });
  }

  @Post(`webhook/${PayboxWebhookType.CHECK}`)
  public async checkPurchaseActive(@Req() req: Request): Promise<string> {
    return this.webhookHandler.handlePayboxWebhook({ type: PayboxWebhookType.CHECK, data: req.body }).catch((err: unknown) => {
      this.sentry.debug(`Error handling check webhook: ${err}`);
      this.sentry.instance().captureException(err);
      throw err;
    });
  }
}
