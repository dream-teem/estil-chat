import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';

import { PaymentMethodEntity } from '../entities/payment-method.entity';
import type { CreatePaymentMethodDto } from '../interfaces/payment-method.interface';

@Injectable()
export class PaymentMethodService {
  constructor(@InjectRepository(PaymentMethodEntity) private paymentMethodRepository: Repository<PaymentMethodEntity>) {}

  public async savePaymentMethod(paymentMethod: CreatePaymentMethodDto): Promise<void> {
    await this.paymentMethodRepository
      .createQueryBuilder('pm')
      .insert()
      .values(paymentMethod)
      .orUpdate(['type', 'owner', 'expiration', 'pan'], ['paymentMethodId', 'userId'])
      .execute();
  }
}
