import type { BaseEntity } from '@/common/base.entity';

export interface City extends BaseEntity {
  name: string;
  slug: string;
}
