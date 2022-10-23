import { BaseEntityStatic } from '@/common/base.entity';
import { TableName } from '@/common/enums/table';
import { Column, Entity, Index } from 'typeorm';
import type { ProductBrand } from '../interfaces/product-brand.interface';

@Entity(TableName.PRODUCT_BRAND)
export class ProductBrandEntity extends BaseEntityStatic implements ProductBrand {
  @Column('varchar')
  name!: string;

  @Column('varchar', { unique: true })
  slug!: string;

  @Index()
  @Column('int')
  order!: number;
}
