import { BaseEntity } from '@/common/base.entity';
import { TableName } from '@/common/interfaces/table';
import { Column, Entity, Index } from 'typeorm';
import type { Size } from '../interfaces/product-size.interface';

@Entity(TableName.SIZE)
export class SizeEntity extends BaseEntity implements Size {
  @Column('int')
  sizeGroupId!: number;

  @Column('varchar')
  title!: string;

  @Index()
  @Column('varchar')
  order!: number;
}
