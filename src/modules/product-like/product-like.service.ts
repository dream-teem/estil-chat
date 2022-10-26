import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TableName } from '@/common/enums/table';

import type { LikedProductResponseDto } from './dto/liked-product.response.dto';
import { ProductLikeEntity } from './product-like.entity';

@Injectable()
export class ProductLikeService {
  constructor(@InjectRepository(ProductLikeEntity) private productLikeRepository: Repository<ProductLikeEntity>) {}

  public async getLikedProductsByUserId(userId: number, viewerId?: number): Promise<LikedProductResponseDto[]> {
    const query = this.productLikeRepository
      .createQueryBuilder('pl')
      .select(['p.id as id', 'p.images as images', 'p.slug as slug', 'p.price as price', 'p.currency as currency'])
      .innerJoin(TableName.PRODUCT, 'p', 'p."id" = pl."productId"')
      .where('pl."userId" = :userId', { userId })
      .andWhere('p.isDeleted = false');

    if (viewerId) {
      query.addSelect(`EXISTS( SELECT 1 FROM ${TableName.PRODUCT_LIKE} WHERE "userId"= ${viewerId} AND "productId" = p.id ) as "isLiked"`);
    }

    return query.getRawMany<LikedProductResponseDto>();
  }

  public async toggleProductLike(productId: number, userId: number): Promise<void> {
    await this.productLikeRepository.query(
      `
      WITH delete_like AS (
        DELETE FROM ${TableName.PRODUCT_LIKE} WHERE "productId" = $1 AND "userId" = $2 returning 1
      )
      INSERT INTO ${TableName.PRODUCT_LIKE} ("productId", "userId") 
        SELECT $1 as "productId", $2 as "userId" WHERE NOT EXISTS (
          SELECT 1 FROM delete_like
        );
    `,
      [productId, userId],
    );
  }
}
