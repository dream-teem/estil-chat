import type { BaseEntityStatic } from '@/common/base.entity';

export interface Color extends BaseEntityStatic {
  title: string;
  hex: string;
  order: number;
  code: string;
}

export interface ProductColor {
  productId: number;
  colorId: number;
}
