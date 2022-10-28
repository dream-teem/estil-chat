import { BaseEntity } from '@/common/base.entity';
import { TableName } from '@/common/enums/table';
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import type { PayboxCharge } from '../interfaces/paybox-charge.interface';
import { PurchaseEntity } from './purchase.entity';

@Entity(TableName.PAYBOX_CHARGE)
@Unique(['payboxChargeId', 'purchaseId'])
export class PayboxChargeEntity extends BaseEntity implements PayboxCharge {
  @Column('varchar')
  payboxChargeId!: string;

  @Column('boolean', { default: false })
  paid!: boolean;

  @Column('boolean', { default: false })
  captured!: boolean;

  @Column('boolean', { default: false })
  refunded!: boolean;

  @Column('int', { nullable: true })
  disputeId!: number | null;

  @Column('int', { nullable: true })
  failure_code!: number | null;

  @Column('text', { nullable: true })
  failure_message!: string | null;

  @Column('int', { unique: true })
  purchaseId!: number;

  @ManyToOne(() => PurchaseEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
    deferrable: 'INITIALLY DEFERRED',
  })
  @JoinColumn({ name: 'purchaseId' })
  purchase?: PurchaseEntity;
}
