import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import type { PaginatedResponseDto } from '@/common/dto/pagination.response.dto';
import { TableName } from '@/common/enums/table';
import { ProductEntity } from '@/modules/product/entities/product.entity';
import type { UserProductsQueryDto } from '@/modules/user/dto/user-products.query.dto';

@Injectable()
export class UserProductService {
  constructor(
    @InjectRepository(ProductEntity) private readonly productRepository: Repository<ProductEntity>,
  ) {}

  public async getProductByUserId(
    userId: number,
    viewerId: number | null,
    { limit, offset, isLiked, isSelling, isSold }: UserProductsQueryDto,
  ): Promise<PaginatedResponseDto> {
    const soldQuery = `
      AND p."userId" = $1
      AND p."isSold" = TRUE
    `;

    const sellingQuery = `
      AND p."userId" = $1
      AND p."isSold" = FALSE
    `;

    const likedJoinQuery = `
      INNER JOIN ${TableName.PRODUCT_LIKE} AS pl 
        ON pl."userId" = $1 AND pl."productId" = p.id
    `;

    const whereQuery = `
      ${isLiked ? likedJoinQuery : ''}
      WHERE p."isDeleted" = FALSE
      ${isSold ? soldQuery : ''}
      ${isSelling ? sellingQuery : ''}
    `;

    const productQuery = `
      SELECT p.id, 
      p.slug, 
      p.price, 
      p.currency, 
      p.images -> 0 as preview, 
      EXISTS(
        SELECT 1 FROM ${TableName.PRODUCT_LIKE} AS pl 
        WHERE pl."productId" = p.id AND pl."userId" = $2
      ) as "isLiked"
      FROM ${TableName.PRODUCT} as p
      ${whereQuery}
      ORDER BY p.id DESC
      LIMIT $3
      OFFSET $4
    `;

    const countQuery = `
      SELECT COUNT(*)
      FROM ${TableName.PRODUCT} as p
      ${whereQuery}
    `;

    const query = `
      SELECT (${countQuery}) AS count,
      (SELECT COALESCE(JSON_AGG(p.*), '[]'::JSON) FROM (${productQuery}) AS p) AS products
    `;

    const [{ products, count }] = await this.productRepository.query(query, [userId, viewerId, limit, offset]);

    return {
      data: products,
      meta: {
        hasMore: (offset + limit) < count,
        limit,
      },
    };
  }
}
