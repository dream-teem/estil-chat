import type { BaseEntity } from '@/common/base.entity';

export type SizeGroup = BaseEntity & {
  title: string;
  slug: string;
  order: number;
};

export type Size = BaseEntity & {
  title: string;
  order: number;
  sizeGroupId: number;
};

export type ProductVariant = {
  productId: number;
  sizeId: number;
  quantity: number;
};
