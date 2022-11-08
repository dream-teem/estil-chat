import { BaseEntity } from '@/common/base.entity';
import { TableName } from '@/common/enums/table';
import { Check, Column, Entity,  JoinColumn,  ManyToOne,  Unique } from 'typeorm';
import { CityEntity } from '../cities/city.entity';

import { User, UserPicture, UserRole } from './user.interface';

@Entity(TableName.USER)
@Unique(['phone', 'countryCode'])
@Check('username = lower(username) and email = lower(email)')
export class UserEntity extends BaseEntity implements User {
  @Column('varchar')
  name!: string;

  @Column('varchar', { unique: true })
  email!: string;

  @Column('varchar', { unique: true })
  username!: string;

  @Column('enum', { enum: UserRole, nullable: true })
  role!: UserRole | null;

  @Column('varchar')
  password!: string;

  @Column('varchar')
  phone!: string;

  @Column('numeric', { precision: 10, scale: 2, default: 0 })
  balance!: number;

  @Column('varchar')
  countryCode!: string;

  @Column('varchar', { nullable: true })
  description!: string | null;

  @Column('int', { nullable: true })
  cityId!: number | null;

  @Column('jsonb', { nullable: true })
  picture!: UserPicture | null;

  @Column('timestamptz', { default: () => 'CURRENT_TIMESTAMP' })
  lastLoggedIn!: Date;

  @Column('varchar', { nullable: true })
  whatsapp!: string | null;

  @ManyToOne(() => CityEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'cityId' })
  city?: CityEntity;
}
