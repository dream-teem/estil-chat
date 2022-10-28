import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { EntityManager, Repository } from 'typeorm';

import { PayboxChargeEntity } from '../entities/paybox-charge.entity';
import type { PayboxCharge } from '../interfaces/paybox-charge.interface';
import type { PayboxInitPaymentParams } from '../interfaces/paybox.interface';
import { PayboxService } from './paybox.service';

@Injectable()
export class PayboxChargeService {
  constructor(
    @InjectRepository(PayboxChargeEntity) private payboxChargeRepository: Repository<PayboxChargeEntity>,
    private readonly paybox: PayboxService,
  ) {}

  public async createCharge(em: EntityManager, purchaseId: number, payboxParams: PayboxInitPaymentParams): Promise<string> {
    const charge = await this.paybox.initPayment(payboxParams);

    if (charge.pg_status === 'error') {
      throw new InternalServerErrorException('Не можем связаться с провайдером оплаты');
    }

    await em.getRepository(PayboxChargeEntity).save({
      purchaseId,
      payboxChargeId: charge.pg_payment_id,
    });
    return charge.pg_redirect_url;
  }

  public async getCharge(purchaseId: number, payboxChargeId: string): Promise<PayboxCharge | null> {
    return this.payboxChargeRepository.findOne({ where: { purchaseId, payboxChargeId } });
  }

  public async updateCharge(em: EntityManager, purchaseId: number, charge: Partial<PayboxCharge>): Promise<void> {
    const res = await em.getRepository(PayboxChargeEntity).update({ purchaseId }, charge);
    if (!res.affected) {
      throw new BadRequestException('Charge not found');
    }
  }
}
