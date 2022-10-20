import { BaseEntity } from '@/common/base.entity';
import { TableName } from '@/common/interfaces/table';
import { Check, Column, Entity,  JoinColumn,  ManyToOne,  Unique } from 'typeorm';
import type { ProductVariant } from '../interfaces/product-size.interface';
import { ProductEntity } from './product.entity';
import { SizeEntity } from './size.entity';

@Entity(TableName.PRODUCT_VARIANT)
@Unique(['productId', 'sizeId'])
@Check('quantity >= 0')
export class ProductVariantEntity extends BaseEntity implements ProductVariant {
  @Column('int')
  sizeId!: number;

  @Column('int')
  productId!: number;

  @Column('int')
  quantity!: number;

  @ManyToOne(() => ProductEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
    deferrable: 'INITIALLY DEFERRED',
  })
  @JoinColumn({ name: 'productId' })
  product?: ProductEntity;

  @ManyToOne(() => SizeEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'sizeId' })
  size?: SizeEntity;
}
