import { TableName } from '@/common/interfaces/table';
import {  Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import type { ProductColor } from '../interfaces/product-color.interface';
import { ColorEntity } from './color.entity';
import { ProductEntity } from './product.entity';

@Entity(TableName.PRODUCT_COLOR)
export class ProductColorEntity implements ProductColor {
  @PrimaryColumn('int')
  productId!: number;

  @PrimaryColumn('int')
  colorId!: number;

  @ManyToOne(() => ProductEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
    deferrable: 'INITIALLY DEFERRED',
  })
  @JoinColumn({ name: 'productId' })
  product?: ProductEntity;

  @ManyToOne(() => ColorEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'colorId' })
  color?: ColorEntity;
}
