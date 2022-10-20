import type { BaseEntity } from '@/common/base.entity';

export interface Following extends BaseEntity {
  userId: number;
  followerId: number;
}
