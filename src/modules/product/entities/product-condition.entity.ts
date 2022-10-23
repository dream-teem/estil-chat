import { BaseEntityStatic } from '@/common/base.entity';
import { TableName } from '@/common/enums/table';
import { Column, Entity, Index } from 'typeorm';
import type { ProductCondition } from '../interfaces/product-condition.interface';

@Entity(TableName.PRODUCT_CONDITION)
export class ProductConditionEntity extends BaseEntityStatic implements ProductCondition {
  @Column('varchar', { unique: true })
  title!: string;

  @Column('varchar')
  description!: string;

  @Column('varchar')
  explanation!: string;

  @Index()
  @Column('varchar')
  order!: number;
}
