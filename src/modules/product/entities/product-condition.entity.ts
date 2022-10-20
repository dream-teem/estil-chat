import { BaseEntity } from '@/common/base.entity';
import { TableName } from '@/common/interfaces/table';
import { Column, Entity, Index } from 'typeorm';
import type { ProductCondition } from '../interfaces/product-condition.interface';

@Entity(TableName.PRODUCT_CONDITION)
export class ProductConditionEntity extends BaseEntity implements ProductCondition {
  @Column('varchar', { unique: true })
  title!: string;

  @Column('varchar')
  description!: string;

  @Column('varchar')
  explanation!: string;

  @Column('varchar', { unique: true })
  slug!: string;

  @Index()
  @Column('varchar')
  order!: number;
}
