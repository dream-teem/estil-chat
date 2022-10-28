import type { BaseEntity } from '@/common/base.entity';

export interface PayboxCharge extends BaseEntity {
  purchaseId: number;
  payboxChargeId: string;
  paid: boolean;
  disputeId: number | null;
  failure_code: number | null;
  failure_message: string | null;
  refunded: boolean;
  captured: boolean;
}
