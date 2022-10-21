import { BaseEntity } from '@/common/base.entity';
import { TableName } from '@/common/interfaces/table';
import { Column, Entity, Index, JoinColumn, ManyToOne, Unique } from 'typeorm';
import type { ProductCategory } from '../interfaces/product-category.interface';
import { SizeGroupEntity } from './size-group.entity';

@Entity(TableName.PRODUCT_CATEGORY)
@Unique(['name', 'parentId'])
@Unique(['slug', 'parentId'])
export class ProductCategoryEntity extends BaseEntity implements ProductCategory {
  @Column('varchar')
  name!: string;

  @Column('varchar')
  slug!: string;

  @Column('int', { nullable: true })
  parentId!: number | null;

  @Column('int', { nullable: true })
  sizeGroupId!: number | null;

  @Column('jsonb', { default: [] })
  synonyms!: string[];

  @Index()
  @Column('varchar')
  order!: number;

  @ManyToOne(() => ProductCategoryEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
    deferrable: 'INITIALLY DEFERRED',
  })
  @JoinColumn({ name: 'parentId' })
  parent?: ProductCategoryEntity;

  @ManyToOne(() => SizeGroupEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
    deferrable: 'INITIALLY DEFERRED',
  })
  @JoinColumn({ name: 'sizeGroupId' })
  sizeGroup?: SizeGroupEntity;
}
