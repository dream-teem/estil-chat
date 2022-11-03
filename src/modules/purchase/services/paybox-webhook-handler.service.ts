import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SentryService } from '@ntegral/nestjs-sentry';
import { EntityManager, Repository } from 'typeorm';

import type { PayboxResultRequestDto } from '../dto/paybox-result.request.dto';
import { PayboxEventEntity } from '../entities/paybox-event.entity';
import {
  PayboxChargeWebhookParams,
  PayboxCheckWebhookParams,
  PayboxWebhookData,
  PayboxWebhookType,
} from '../interfaces/paybox-webhook.interface';
import type { PayboxWebhookResponse } from '../interfaces/paybox.interface';
import { makeParamsWithSignature, makePayboxSignature, makeXmlData } from '../utils/paybox';
import { PayboxChargeService } from './paybox-charge.service';
import { PayboxService } from './paybox.service';
import { PurchaseService } from './purchase.service';

@Injectable()
export class PayboxWebhookHandlerService {
  private PAYBOX_PAYMENT_SECRET: string = process.env.PAYBOX_PAYMENT_SECRET;

  constructor(
    private readonly purchase: PurchaseService,
    private readonly payboxCharge: PayboxChargeService,
    private readonly paybox: PayboxService,
    private readonly sentry: SentryService,
    @InjectRepository(PayboxEventEntity) private payboxEventRepository: Repository<PayboxEventEntity>,
  ) {}

  public async handlePayboxWebhook({ type, data }: PayboxWebhookData): Promise<string> {
    const signature = makePayboxSignature(type, data, this.PAYBOX_PAYMENT_SECRET);

    if (signature !== data.pg_sig) {
      throw new BadRequestException('Не валидный signature');
    }
    console.log(type, data);
    let response: PayboxWebhookResponse;
    switch (type) {
      case PayboxWebhookType.CHECK:
        response = await this.handleCheckPaymentAllowed(data);
        break;
      case PayboxWebhookType.CHARGE:
        response = await this.handleChargeWebhook(data);
        break;
      default:
        throw new BadRequestException('Неправильный тип');
    }

    return makeXmlData(response);
  }

  private async handleCheckPaymentAllowed(data: PayboxCheckWebhookParams): Promise<PayboxWebhookResponse> {
    const isAllowed = await this.purchase.checkPurchaseAllowed(parseInt(data.pg_order_id, 10));

    if (!isAllowed) {
      return this.getPayboxWebhookResponse(PayboxWebhookType.CHECK, 'rejected', 'Время платежа истекло');
    }

    return this.getPayboxWebhookResponse(PayboxWebhookType.CHECK, 'ok', 'Можно оплачивать');
  }

  private async handleChargeWebhook(data: PayboxChargeWebhookParams): Promise<PayboxWebhookResponse> {
    const isPaid = data.pg_result === '1';
    const isCaptured = data.pg_captured === '1';

    return this.payboxEventRepository.manager.transaction(async (em: EntityManager) => {
      const { isProcessed } = await this.createPayboxEvent(em, data, PayboxWebhookType.CHARGE);

      if (!isProcessed) {
        const isPurchaseActive = await this.purchase.checkPurchaseAllowed(parseInt(data.pg_order_id, 10));

        if (!isPurchaseActive) {
          if (data.pg_can_reject === '1') {
            await this.revokePayment(data);
          } else {
            this.sentry
              .instance()
              .captureException(`pg_can_reject is not "1" when revoking payment on inactive purchase ${data.pg_order_id}`);
          }

          return this.getPayboxWebhookResponse(PayboxWebhookType.CHARGE, 'rejected', 'Покупка уже не активна');
        }

        await this.payboxCharge.updateCharge(em, parseInt(data.pg_order_id, 10), {
          captured: isCaptured,
          paid: isPaid,
        });

        if (isPaid) {
          await this.purchase.processSuccessfulPayment(em, data);
        } else {
          await this.purchase.processFailedPayment(em, data);
        }
      }

      return this.getPayboxWebhookResponse(PayboxWebhookType.CHARGE, 'ok', 'Заказ обработан');
    });
  }

  private async createPayboxEvent(
    em: EntityManager,
    data: PayboxResultRequestDto,
    type: PayboxWebhookType,
  ): Promise<Record<'isProcessed', boolean>> {
    const result = await em
      .getRepository(PayboxEventEntity)
      .createQueryBuilder('pe')
      .insert()
      .values({
        type,
        purchaseId: parseInt(data.pg_order_id, 10),
        payboxId: data.pg_payment_id,
        data: JSON.stringify(data),
      })
      .orIgnore()
      .returning('(xmax = 0) as inserted')
      .execute();

    return {
      isProcessed: !result.raw[0]?.inserted,
    };
  }

  private async getPayboxWebhookResponse(
    type: PayboxWebhookType,
    status: 'ok' | 'rejected',
    description: string,
  ): Promise<PayboxWebhookResponse> {
    return makeParamsWithSignature(type, { pg_status: status, pg_description: description }, this.PAYBOX_PAYMENT_SECRET);
  }

  private async revokePayment(data: PayboxChargeWebhookParams): Promise<void> {
    const revokeResponse = await this.paybox.revokePayment({
      pg_payment_id: data.pg_payment_id,
      pg_refund_amount: data.pg_amount,
    });

    if (revokeResponse.pg_status === 'error') {
      this.sentry.instance().captureException(`Error while revoking payment ${data.pg_order_id}`);
    }
  }
}
