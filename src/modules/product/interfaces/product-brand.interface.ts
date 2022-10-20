import type { BaseEntity } from '@/common/base.entity';

export type ProductBrand = BaseEntity & {
  name: string;
  slug: string;
  order: number;
};
