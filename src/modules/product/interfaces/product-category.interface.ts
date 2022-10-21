import type { BaseEntityStatic } from '@/common/base.entity';

export interface ProductCategory extends BaseEntityStatic {
  name: string;
  slug: string;
  parentId: number | null;
  sizeGroupId: number | null;
  synonyms: string[];
  order: number;
  path: string;
}
