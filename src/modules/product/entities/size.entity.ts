import { BaseEntityStatic } from '@/common/base.entity';
import { TableName } from '@/common/enums/table';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import type { Size } from '../interfaces/product-size.interface';
import { SizeGroupEntity } from './size-group.entity';

@Entity(TableName.SIZE)
export class SizeEntity extends BaseEntityStatic implements Size {
  @Column('int')
  sizeGroupId!: number;

  @Column('varchar')
  title!: string;

  @Index()
  @Column('int')
  order!: number;

  @ManyToOne(() => SizeGroupEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
    deferrable: 'INITIALLY DEFERRED',
  })
  @JoinColumn({ name: 'sizeGroupId' })
  sizeGroup?: SizeGroupEntity;
}
