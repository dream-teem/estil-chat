import { BaseEntity } from '@/common/base.entity';
import { TableName } from '@/common/interfaces/table';
import { Column, Entity, Index } from 'typeorm';
import type { Color } from '../interfaces/product-color.interface';

@Entity(TableName.COLOR)
export class ColorEntity extends BaseEntity implements Color {
  @Column('varchar')
  title!: string;

  @Column('varchar')
  hex!: string;

  @Index()
  @Column('varchar')
  order!: number;

  @Column('varchar', { unique: true })
  code!: string;
}
