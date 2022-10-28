import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import type { PayboxResultRequestDto } from '../dto/paybox-result.request.dto';
import { PayboxEventEntity } from '../entities/paybox-event.entity';
import { PayboxEventType } from '../interfaces/paybox-event.interface';
import { getScriptNameFromUrl, makePayboxSignature } from '../utils/paybox';
import { PayboxChargeService } from './paybox-charge.service';
import { PurchaseService } from './purchase.service';

@Injectable()
export class PayboxWebhookHandlerService {
  constructor(
    private readonly purchase: PurchaseService,
    private readonly payboxCharge: PayboxChargeService,
    @InjectRepository(PayboxEventEntity) private payboxEventRepository: Repository<PayboxEventEntity>,
  ) {}

  public async handlePayboxWebhook(url: string, result: PayboxResultRequestDto): Promise<void> {
    const scriptName = getScriptNameFromUrl(url);
    const signature = makePayboxSignature(scriptName, result, process.env.PAYBOX_PAYMENT_SECRET);

    if (signature !== result.pg_sig) {
      throw new BadRequestException('Не валидный signature');
    }

    const isPaid = result.pg_result === '1';
    const isCaptured = result.pg_captured === '1';
    await this.payboxEventRepository.manager.transaction(async (em: EntityManager) => {
      await this.createPayboxEvent(em, result, PayboxEventType.CHARGE);

      await this.payboxCharge.updateCharge(em, parseInt(result.pg_order_id, 10), {
        captured: isCaptured,
        paid: isPaid,
      });

      if (isPaid) {
        await this.purchase.processSuccessfulPayment(em, result);
      } else {
        await this.purchase.processFailedPayment(em, result);
      }
    });
  }

  private async createPayboxEvent(em: EntityManager, data: PayboxResultRequestDto, type: PayboxEventType): Promise<void> {
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

    if (!result.raw[0]?.inserted) {
      throw new BadRequestException('Already processed');
    }
  }
}
