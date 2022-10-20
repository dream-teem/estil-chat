import type { BaseEntity } from '@/common/base.entity';

export type ProductCondition = BaseEntity & {
  title: string;
  description: string;
  explanation: string;
  order: number;
};
