import { BaseEntity } from '@/common/base.entity';
import { TableName } from '@/common/interfaces/table';
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { ProductEntity } from '../product/entities/product.entity';
import { UserEntity } from '../user';
import type { ProductLike } from './product-like.interface';

@Entity(TableName.PRODUCT_LIKE)
@Unique(['userId', 'productId'])
export class ProductLikeEntity extends BaseEntity implements ProductLike {
  @Column('int')
  userId!: number;

  @Column('int')
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
