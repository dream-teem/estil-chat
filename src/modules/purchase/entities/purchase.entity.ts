import { BaseEntity } from '@/common/base.entity';
import { TableName } from '@/common/enums/table';
import { ProductEntity } from '@/modules/product/entities/product.entity';
import { SizeEntity } from '@/modules/product/entities/size.entity';
import { UserEntity } from '@/modules/user';
import { Check, Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import {  PaymentStatus, Purchase, OrderStatus } from '../interfaces/purchase.interface';

@Entity(TableName.PURCHASE)
@Check('price >= 0 and quantity > 0')
export class PurchaseEntity extends BaseEntity implements Purchase {
  @Column('int')
  productId!: number;

  @Column('int', { nullable: true })
  productSizeId!: number | null;

  @Column('int')
  userId!: number;

  @Column('int')
  quantity!: number;

  @Column('enum', { enum: PaymentStatus, default: PaymentStatus.PENDING })
  paymentStatus!: PaymentStatus;

  @Column('enum', { enum: OrderStatus, default: OrderStatus.PENDING })
  orderStatus!: OrderStatus;

  @Column('numeric', { precision: 10, scale: 2 })
  price!: number;

  @Column('numeric', { precision: 10, scale: 2  })
  serviceFee!: number;

  @Column('numeric', { precision: 10, scale: 2, default: 0 })
  shippingPrice!: number;

  @Column('int', { nullable: true })
  shippingId!: number | null;

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
