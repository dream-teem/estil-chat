import { TableName } from '@/common/enums/table';
import { Column, Entity, Index, PrimaryGeneratedColumn, Unique } from 'typeorm';
import type { Verification } from './verification.interface';

@Entity(TableName.VERIFICATION)
@Unique(['phone', 'smsCode', 'countryCode'])
export class VerificationEntity implements Verification {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('varchar')
  countryCode!: string;

  @Column('varchar')
  phone!: string;

  @Column('boolean', { default: false })
  isVerified!: boolean;

  @Column('varchar')
  smsCode!: string;

  @Index()
  @Column('timestamptz', { default: () => 'CURRENT_TIMESTAMP' })
  expiration!: Date;
}
