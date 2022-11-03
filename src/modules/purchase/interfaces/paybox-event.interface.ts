import type { BaseEntity } from '@/common/base.entity';

import type { PayboxWebhookType } from './paybox-webhook.interface';

export interface PayboxEvent extends BaseEntity {
  type: PayboxWebhookType;
  purchaseId: number;
  payboxId: string;
  data: string;
}
