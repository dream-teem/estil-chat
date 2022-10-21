import { TableName } from '@/common/interfaces/table';
import { Check, Column, Entity,  JoinColumn,  ManyToOne,  PrimaryColumn } from 'typeorm';
import type { ProductVariant } from '../interfaces/product-size.interface';
import { ProductEntity } from './product.entity';
import { SizeEntity } from './size.entity';

@Entity(TableName.PRODUCT_VARIANT)
@Check('quantity >= 0')
export class ProductVariantEntity implements ProductVariant {
  @PrimaryColumn('int')
  sizeId!: number;

  @PrimaryColumn('int')
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
