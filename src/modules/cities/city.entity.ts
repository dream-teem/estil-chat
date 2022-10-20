import { BaseEntity } from '@/common/base.entity';
import { TableName } from '@/common/interfaces/table';
import { Column, Entity } from 'typeorm';
import type { City } from './city.interface';

@Entity(TableName.CITY)
export class CityEntity extends BaseEntity implements City {
  @Column('varchar', { unique: true })
  name!: string;
  @Column('varchar', { unique: true })
  slug!: string;
}
