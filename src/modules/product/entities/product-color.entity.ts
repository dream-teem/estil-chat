import { BaseEntity } from '@/common/base.entity';
import { TableName } from '@/common/interfaces/table';
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import type { ProductColor } from '../interfaces/product-color.interface';
import { ColorEntity } from './color.entity';
import { ProductEntity } from './product.entity';

@Entity(TableName.PRODUCT_COLOR)
@Unique(['productId', 'colorId'])
export class ProductColorEntity extends BaseEntity implements ProductColor {
  @Column('int')
  productId!: number;

  @Column('int')
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
