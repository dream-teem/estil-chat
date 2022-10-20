import type { BaseEntity } from '@/common/base.entity';

export enum ProductCurrency {
  KZT = 'KZT',
  USD = 'USD',
  RUB = 'RUB',
}

export type ProductThumbnailType = 150 | 310 | 428 | 624 | 1280;
export type ProductThumbnails = Record<ProductThumbnailType, string>;

export interface ProductImage {
  original: string;
  thumbnails: ProductThumbnails;
}

export interface Product extends BaseEntity {
  description: string;
  slug: string;
  userId: number;
  brandId: number | null;
  categoryId: number;
  cityId: number;
  images: ProductImage[];
  conditionId: number;
  price: number;
  quantity: number | null;
  promoted: boolean;
  currency: ProductCurrency;
  isDeleted: boolean;
  isSold: boolean;
}
