import { BaseEntity } from '@/common/base.entity';
import { TableName } from '@/common/interfaces/table';
import { Column, Entity, Index } from 'typeorm';
import type { ProductBrand } from '../interfaces/product-brand.interface';

@Entity(TableName.PRODUCT_BRAND)
export class ProductBrandEntity extends BaseEntity implements ProductBrand {
  @Column('varchar')
  name!: string;

  @Column('varchar', { unique: true })
  slug!: string;

  @Index()
  @Column('varchar')
  order!: number;
}
