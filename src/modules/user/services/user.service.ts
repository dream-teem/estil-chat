import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TableName } from '@/common/enums/table';

import type { UserProfileResponseDto } from '../dto/user-profile.response.dto';
import type { UserResponseDto } from '../dto/user.response.dto';
import { UserEntity } from '../user.entity';

@Injectable()
export class UserService {
  constructor(@InjectRepository(UserEntity) private userRepository: Repository<UserEntity>) {}

  public async findByUsername(username: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { username } });
  }

  public async checkUsername(username: string): Promise<Record<'exists', boolean>> {
    const count = await this.userRepository.count({ where: { username } });
    return {
      exists: count !== 0,
    };
  }

  public async getProfile(userId: number): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'phone', 'username', 'email', 'name', 'description', 'picture', 'role', 'cityId', 'lastLoggedIn'],
    });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    return user;
  }

  public async getProfileByUsername(username: string, viewerId?: number): Promise<UserProfileResponseDto> {
    const user = await this.getUserProfileByUsernameQuery(username, viewerId);

    if (!user) {
      throw new NotFoundException('Пользователь не существует');
    }

    return user;
  }

  private async getUserProfileByUsernameQuery(username: string, viewerId?: number): Promise<UserProfileResponseDto | null> {
    const selectFollowedQuery = `
      (u.id = $2) as moderator,
      EXISTS(
        SELECT 1
        from ${TableName.FOLLOWING} AS f
        WHERE f."userId" = u."id"
            AND f."followerId" = $2
      ) AS "isFollowed"
    `;
    const parameters: (string | number)[] = [username];

    if (viewerId) {
      parameters.push(viewerId);
    }

    const query = `SELECT 
      u.id, u.picture, u.description, 
      u.name, u.username, u."lastLoggedIn",
      (
        SELECT COUNT(*)::INT 
        FROM ${TableName.FOLLOWING} AS f
          WHERE u.id = f."userId"
      ) AS followers,
      (
        SELECT COUNT(*)::INT
        FROM ${TableName.FOLLOWING} AS f
          WHERE u.id = f."followerId" 
      ) AS following,
      (
        SELECT 
          json_build_object(
            'count',
            COALESCE(COUNT(*), 0)::int,
            'rating',
            COALESCE(AVG(r.rating), 0)::int
          )
        FROM ${TableName.PRODUCT_RATING} as r
          WHERE u."id" = r."userId"
      ) AS rating,
      (
        SELECT COUNT(*)::INT
        FROM ${TableName.PRODUCT} AS p
          WHERE u."id" = p."userId"
          AND p."isSold" = true
          AND p."isDeleted" = false
      ) AS "productCount"
      ${viewerId ? `, ${selectFollowedQuery}` : ''}
    FROM "${TableName.USER}" AS u
    WHERE u.username = $1
  `;

    const [user] = <UserProfileResponseDto[]> await this.userRepository.query(query, parameters);

    return user || null;
  }
}
