import { BaseEntityStatic } from '@/common/base.entity';
import { TableName } from '@/common/enums/table';
import { Column, Entity, Index } from 'typeorm';
import type { Color } from '../interfaces/product-color.interface';

@Entity(TableName.COLOR)
export class ColorEntity extends BaseEntityStatic implements Color {
  @Column('varchar')
  title!: string;

  @Column('varchar')
  hex!: string;

  @Index()
  @Column('int')
  order!: number;

  @Column('varchar', { unique: true })
  code!: string;
}
