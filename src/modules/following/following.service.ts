import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TableName } from '@/common/enums/table';

import type { FollowUserResponseDto } from './dto/follow-user.response.dto';
import { FollowingEntity } from './following.entity';

@Injectable()
export class FollowingService {
  constructor(@InjectRepository(FollowingEntity) private followingRepository: Repository<FollowingEntity>) {}

  public async getFollowersByUserId(userId: number, viewerId?: number): Promise<FollowUserResponseDto[]> {
    const query = this.followingRepository
      .createQueryBuilder('f')
      .select(['follower.id as id', 'follower.username as username', 'follower.picture as picture'])
      .innerJoin(TableName.USER, 'follower', 'f."followerId" = follower.id')
      .where('f."userId" = :userId', { userId });

    if (viewerId) {
      query.addSelect(
        `EXISTS( SELECT 1 FROM ${TableName.FOLLOWING} WHERE "userId"= f."followerId" AND "followerId" = ${viewerId} ) as "isFollowing"`,
      );
    }

    return query.getRawMany<FollowUserResponseDto>();
  }

  public async getFollowingsByUserId(userId: number, viewerId?: number): Promise<FollowUserResponseDto[]> {
    const query = this.followingRepository
      .createQueryBuilder('f')
      .select(['following.id as id', 'following.username as username', 'following.picture as picture'])
      .innerJoin(TableName.USER, 'following', 'f."userId" = following.id')
      .where('f."followerId" = :userId', { userId });

    if (viewerId) {
      query.addSelect(
        `EXISTS( SELECT 1 FROM ${TableName.FOLLOWING} WHERE "userId"= f."userId" AND "followerId" = ${viewerId} ) as "isFollowing"`,
      );
    }

    return query.getRawMany<FollowUserResponseDto>();
  }

  public async toggleUserFollow(userId: number, followerUserId: number): Promise<void> {
    await this.followingRepository.query(
      `
      WITH delete_follow AS (
        DELETE FROM ${TableName.FOLLOWING} WHERE "userId" = $1 AND "followerId" = $2 returning 1
      )
      INSERT INTO ${TableName.FOLLOWING} ("userId", "followerId") 
        SELECT $1 as "userId", $2 as "followerId" WHERE NOT EXISTS(
          SELECT 1 FROM delete_follow
        );
    `,
      [userId, followerUserId],
    );
  }
}
