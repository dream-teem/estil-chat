import { BaseEntity } from '@/common/base.entity';
import { TableName } from '@/common/enums/table';
import { CityEntity } from '@/modules/cities/city.entity';
import { UserEntity } from '@/modules/user/user.entity';
import { Column, Entity, Check, ManyToOne, JoinColumn } from 'typeorm';
import { Product, ProductCurrency, ProductImage } from '../interfaces/product.interface';
import { ProductBrandEntity } from './product-brand.entity';
import { ProductCategoryEntity } from './product-category.entity';
import { ProductConditionEntity } from './product-condition.entity';

@Entity(TableName.PRODUCT)
@Check('"price" >= 0')
@Check('"quantity" IS NULL OR "quantity" >= 0')
export class ProductEntity extends BaseEntity implements Product {
  @Column('text')
  description!: string;

  @Column('varchar', { unique: true })
  slug!: string;

  @Column('int')
  userId!: number;

  @Column('int', { nullable: true })
  brandId!: number | null;

  @Column('int')
  cityId!: number;

  @Column('int')
  categoryId!: number;

  @Column('int')
  conditionId!: number;

  @Column('numeric', { precision: 10, scale: 2 })
  price!: number;

  @Column('enum', { default: ProductCurrency.KZT, enum: ProductCurrency })
  currency!: ProductCurrency;

  @Column('int', { nullable: true })
  quantity!: number | null;

  @Column('jsonb', { default: [] })
  images!: ProductImage[];

  @Column('boolean', { default: false })
  promoted!: boolean;

  @Column('boolean', { default: false })
  isDeleted!: boolean;

  @Column('boolean', { default: false })
  isSold!: boolean;

  @ManyToOne(() => UserEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'userId' })
  user?: UserEntity;

  @ManyToOne(() => ProductCategoryEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'categoryId' })
  category?: ProductCategoryEntity;

  @ManyToOne(() => ProductBrandEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'brandId' })
  brand?: ProductBrandEntity;

  @ManyToOne(() => ProductConditionEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'conditionId' })
  condition?: ProductConditionEntity;

  @ManyToOne(() => CityEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'cityId' })
  city?: CityEntity;
}
