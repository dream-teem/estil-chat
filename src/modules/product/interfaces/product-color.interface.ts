import type { BaseEntity } from '@/common/base.entity';

export type Color = BaseEntity & {
  title: string;
  hex: string;
  order: number;
  code: string;
};

export type ProductColor = {
  productId: number;
  colorId: number;
};
