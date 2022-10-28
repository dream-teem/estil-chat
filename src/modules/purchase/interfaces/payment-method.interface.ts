import type { BaseEntity } from '@/common/base.entity';

export enum PaymentMethodType {
  WALLET = 'wallet',
  INTERNETBANK = 'internetbank',
  OTHER = 'other',
  BANKCARD = 'bankcard',
  CASH = 'cash',
  MOBILE_COMMERCE = 'mobile_commerce',
}

export interface PaymentMethod extends BaseEntity {
  paymentMethodId: number;
  pan: string;
  expiration: string;
  owner: string;
  type: PaymentMethodType;
}

export interface CreatePaymentMethodDto extends Omit<PaymentMethod, 'id' | 'createdAt' | 'updatedAt'> {}
