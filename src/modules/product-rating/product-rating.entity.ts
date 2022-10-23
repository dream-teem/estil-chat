import { BaseEntity } from '@/common/base.entity';
import { TableName } from '@/common/enums/table';
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { ProductEntity } from '../product/entities/product.entity';
import { UserEntity } from '../user';
import type { ProductRating } from './product-rating.interface';

@Entity(TableName.PRODUCT_RATING)
@Unique(['raterId', 'productId'])
export class ProductRatingEntity extends BaseEntity implements ProductRating {
  @Column('int')
  userId!: number;

  @Column('int')
  raterId!: number;

  @Column('int')
  productId!: number;

  @Column('numeric', { nullable: false, precision: 2, scale: 1 })
  rating!: number;

  @Column('text', { nullable: true })
  feedback!: string | null;

  @ManyToOne(() => UserEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'userId' })
  user?: UserEntity;

  @ManyToOne(() => UserEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'raterId' })
  rater?: UserEntity;

  @ManyToOne(() => ProductEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'productId' })
  product?: ProductEntity;
}
