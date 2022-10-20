import { BaseEntity } from '@/common/base.entity';
import { TableName } from '@/common/interfaces/table';
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { UserEntity } from '../user';
import type { Following } from './following.interface';

@Entity(TableName.FOLLOWING)
@Unique(['userId', 'followerId'])
export class FollowingEntity extends BaseEntity implements Following {
  @Column('int')
  userId!: number;

  @Column('int')
  followerId!: number;

  @ManyToOne(() => UserEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'userId' })
  user?: UserEntity;

  @ManyToOne(() => UserEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'followerId' })
  follower?: UserEntity;
}
