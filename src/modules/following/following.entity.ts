import { TableName } from '@/common/enums/table';
import { Check, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { UserEntity } from '@/modules/user/user.entity';
import type { Following } from './following.interface';

@Entity(TableName.FOLLOWING)
@Check('"followerId" <> "userId"')
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
