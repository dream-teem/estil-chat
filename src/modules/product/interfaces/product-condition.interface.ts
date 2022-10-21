import type { BaseEntityStatic } from '@/common/base.entity';

export interface ProductCondition extends BaseEntityStatic {
  title: string;
  description: string;
  explanation: string;
  order: number;
}
