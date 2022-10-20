import type { BaseEntity } from '@/common/base.entity';

export interface ProductLike extends BaseEntity {
  userId: number;
  productId: number;
}
