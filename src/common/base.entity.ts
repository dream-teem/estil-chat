import { Entity, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class BaseEntity {
  @PrimaryGeneratedColumn('identity', {
    generatedIdentity: 'ALWAYS'
  })
  id!: number;

  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: string;

  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt!: string;
}

/**
 * A base entity for static data such as category, size, size_group
 * These tables do not need timestamp, and need ability to insert explicit "id"
 */
@Entity()
export class BaseEntityStatic {
  @PrimaryGeneratedColumn('identity', {
    generatedIdentity: 'BY DEFAULT'
  })
  id!: number;
}