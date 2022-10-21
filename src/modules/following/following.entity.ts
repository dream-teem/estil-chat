import { TableName } from '@/common/interfaces/table';
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { UserEntity } from '../user';
import type { Following } from './following.interface';

@Entity(TableName.FOLLOWING)
export class FollowingEntity implements Following {
  @PrimaryColumn('int')
  userId!: number;

  @PrimaryColumn('int')
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
