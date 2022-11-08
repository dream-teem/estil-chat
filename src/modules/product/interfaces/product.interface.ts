import type { BaseEntity } from '@/common/base.entity';

import type { PRODUCT_IMAGE_THUMBNAILS } from '../constants/product.constant';

export enum ProductCurrency {
  KZT = 'KZT',
  USD = 'USD',
  RUB = 'RUB',
}

export type ProductThumbnailAll = typeof PRODUCT_IMAGE_THUMBNAILS;
export type ProductThumbnailType = ProductThumbnailAll[number];

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
