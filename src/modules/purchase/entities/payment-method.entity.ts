import { BaseEntity } from '@/common/base.entity';
import { TableName } from '@/common/enums/table';
import { Column, Entity, Unique } from 'typeorm';
import type { PaymentMethod, PaymentMethodType } from '../interfaces/payment-method.interface';

@Entity(TableName.PAYMENT_METHOD)
@Unique(['paymentMethodId','userId'])
export class PaymentMethodEntity extends BaseEntity implements PaymentMethod {
  @Column('int')
  paymentMethodId!: number;

  @Column('int')
  userId!: number;

  @Column('varchar')
  pan!: string;

  @Column('varchar')
  expiration!: string;

  @Column('varchar')
  owner!: string;

  @Column('varchar')
  type!: PaymentMethodType;
}
