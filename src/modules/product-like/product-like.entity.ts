import { TableName } from '@/common/enums/table';
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { ProductEntity } from '../product/entities/product.entity';
import { UserEntity } from '../user';
import type { ProductLike } from './product-like.interface';

@Entity(TableName.PRODUCT_LIKE)
export class ProductLikeEntity implements ProductLike {
  @PrimaryColumn('int')
  userId!: number;

  @PrimaryColumn('int')
  productId!: number;

  @ManyToOne(() => UserEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'userId' })
  user?: UserEntity;

  @ManyToOne(() => ProductEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'productId' })
  product?: ProductEntity;
}
