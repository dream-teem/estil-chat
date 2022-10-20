import { BaseEntity } from '@/common/base.entity';
import { Check, Column, Entity,  Unique } from 'typeorm';

import { User, UserPicture, UserRole } from './user.interface';

@Entity('user')
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

  @Column('varchar')
  countryCode!: string;

  @Column('varchar', { nullable: true })
  description!: string | null;

  @Column('varchar', { nullable: true })
  cityId!: number | null;

  @Column('varchar', { nullable: true })
  picture!: UserPicture | null;

  @Column('timestamptz', { default: () => 'CURRENT_TIMESTAMP' })
  lastLoggedIn!: Date;

  @Column('varchar', { nullable: true })
  whatsapp!: string | null;
}
