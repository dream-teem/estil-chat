import { BaseEntity } from '@/common/base.entity';
import { TableName } from '@/common/enums/table';
import { ProductEntity } from '@/modules/product/entities/product.entity';
import { SizeEntity } from '@/modules/product/entities/size.entity';
import { UserEntity } from '@/modules/user';
import { Check, Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { DeliveryStatus, Purchase, PurchaseStatus } from '../interfaces/purchase.interface';

@Entity(TableName.PURCHASE)
@Check('price >= 0 and quantity > 0')
export class PurchaseEntity extends BaseEntity implements Purchase {
  @Column('int')
  productId!: number;

  @Column('int', { nullable: true })
  productSizeId!: number | null;

  @Column('int')
  userId!: number;

  @Column('int', { nullable: true })
  addressId!: number | null;

  @Column('int')
  quantity!: number;

  @Column('enum', { enum: PurchaseStatus, default: PurchaseStatus.IN_PROGRESS })
  status!: PurchaseStatus;

  @Column('enum', { enum: DeliveryStatus, nullable: true })
  deliveryStatus!: DeliveryStatus | null;

  @Column('numeric', { precision: 10, scale: 2, default: 0 })
  price!: number;

  @Column('numeric', { precision: 10, scale: 2, default: 0 })
  deliveryPrice!: number;

  @Column('varchar', { nullable: true })
  trackingNumber!: string | null;

  @Column('timestamptz', { nullable: true })
  shippedAt!: Date | null;

  @Column('timestamptz', { nullable: true })
  deliveredAt!: Date | null;

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
  @JoinColumn({ name: 'productIdId' })
  product?: ProductEntity;

  @ManyToOne(() => SizeEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'productSizeId' })
  productSize?: SizeEntity;
}
