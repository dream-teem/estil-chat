import { BaseEntity } from '@/common/base.entity';
import { TableName } from '@/common/enums/table';
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { PayboxEvent, PayboxEventType } from '../interfaces/paybox-event.interface';
import { PurchaseEntity } from './purchase.entity';

@Entity(TableName.PAYBOX_EVENT)
@Unique(['payboxId', 'purchaseId'])
export class PayboxEventEntity extends BaseEntity implements PayboxEvent {
  @Column('varchar')
  payboxId!: string;

  @Column('text')
  data!: string;

  @Column('enum', { enum: PayboxEventType })
  type!: PayboxEventType;

  @Column('int')
  purchaseId!: number;

  @ManyToOne(() => PurchaseEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'purchaseId' })
  purchase?: PurchaseEntity;
}
