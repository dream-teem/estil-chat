import type { BaseEntity } from '@/common/base.entity';

export interface ProductCategory extends BaseEntity {
  name: string;
  slug: string;
  parentId: number | null;
  sizeGroupId: number | null;
  synonyms: string[];
  order: number;
}
