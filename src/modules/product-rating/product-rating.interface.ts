import type { BaseEntity } from '@/common/base.entity';

export interface ProductRating extends BaseEntity {
  productId: number;
  userId: number;
  raterId: number;
  rating: number;
  feedback: string | null;
  // TODO: add purchaseId when payment is added
}
