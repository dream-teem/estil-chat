import { BaseEntityStatic } from '@/common/base.entity';
import { TableName } from '@/common/interfaces/table';
import { Column, Entity, Index } from 'typeorm';
import type { SizeGroup } from '../interfaces/product-size.interface';

@Entity(TableName.SIZE_GROUP)
export class SizeGroupEntity extends BaseEntityStatic implements SizeGroup {
  @Column('varchar', { unique: true })
  slug!: string;

  @Column('varchar')
  title!: string;

  @Index()
  @Column('varchar')
  order!: number;
}
