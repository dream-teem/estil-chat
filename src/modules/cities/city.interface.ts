import type { BaseEntityStatic } from '@/common/base.entity';

export interface City extends BaseEntityStatic {
  name: string;
  slug: string;
}
