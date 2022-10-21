import type { BaseEntityStatic } from '@/common/base.entity';

export interface SizeGroup extends BaseEntityStatic {
  title: string;
  slug: string;
  order: number;
}

export interface Size extends BaseEntityStatic {
  title: string;
  order: number;
  sizeGroupId: number;
}

export interface ProductVariant {
  productId: number;
  sizeId: number;
  quantity: number;
}
