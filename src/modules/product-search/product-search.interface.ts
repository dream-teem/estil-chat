import type { AggregationsDoubleTermsAggregate } from '@elastic/elasticsearch/lib/api/types';

import type { ProductImage } from '../product/interfaces/product.interface';

export type ProductBrandDocument = {
  id: number;
  name: string;
};

export type ProductUserDocument = {
  id: number;
  username: string;
};

export type ProductVariantDocument = {
  sizeId: number;
  title: string;
  quantity: number;
};

export type ProductConditionDocument = {
  id: number;
  title: string;
};

export type ProductCategoryDocument = {
  id: number;
  name: string;
  path: string;
};

export type ProductColorDocument = {
  id: number;
  title: string;
  hex: string;
  code: string;
};

export type ProductImageDocument = {
  id: number;
  original: string;
  thumbnails: object;
};

export type ProductDocument = {
  id: number;
  slug: string;
  description: string;
  user: ProductUserDocument;
  brand: ProductBrandDocument | null;
  categories: ProductCategoryDocument[];
  variants: ProductVariantDocument | null;
  condition: ProductConditionDocument;
  colors: ProductColorDocument[];
  images: ProductImageDocument[];
  price: number;
  currency: string;
  isDeleted: boolean;
  isSold: boolean;
  createdAt: string;
  updatedAt: string;
};

type CategorySizeAggregate = AggregationsDoubleTermsAggregate & {
  variants: AggregationsDoubleTermsAggregate;
};

export type ProductFilterAggregates = Record<
'brands' | 'colors' | 'conditions',
AggregationsDoubleTermsAggregate
> & {
  categories: CategorySizeAggregate;
};

export interface ProductSearchDocumentRO extends ProductDocument {
  image: ProductImage[];
}
