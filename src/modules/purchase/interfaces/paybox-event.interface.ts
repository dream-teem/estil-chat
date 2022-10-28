import type { BaseEntity } from '@/common/base.entity';

export enum PayboxEventType {
  CHARGE = 'charge',
  REFUND = 'refund',
  PAYOUT = 'payout',
}
export interface PayboxEvent extends BaseEntity {
  type: PayboxEventType;
  purchaseId: number;
  payboxId: string;
  data: string;
}
