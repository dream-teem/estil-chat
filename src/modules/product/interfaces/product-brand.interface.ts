import type { BaseEntityStatic } from '@/common/base.entity';

export interface ProductBrand extends BaseEntityStatic {
  name: string;
  slug: string;
  order: number;
}
