import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import slugify from 'slugify';
import { EntityManager, Repository } from 'typeorm';

import { TableName } from '@/common/enums/table';
import type { Payload } from '@/modules/auth';

import type { CreateProductRequestDto } from '../dto/create-product.request.dto';
import type { ProductResponseDto } from '../dto/product.response.dto';
import { ProductEntity } from '../entities/product.entity';
import { ColorService } from './color.service';
import { SizeService } from './size.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity) private readonly productRepository: Repository<ProductEntity>,
    private readonly size: SizeService,
    private readonly color: ColorService,
  ) {}

  public async getProductBySlug(slug: string, viewerId: number | null = null): Promise<ProductResponseDto > {
    const query = `
      SELECT p.id, p.description, p.slug, p.price, p.currency, 
        p."createdAt", p.images,p.quantity,
        (
          SELECT COUNT(*) FROM ${TableName.PRODUCT_LIKE} AS pl
            WHERE pl."productId" = p.id
        ) AS likes,
        ${
  viewerId ? `EXISTS (
          SELECT 1 FROM ${TableName.PRODUCT_LIKE} AS pl
            WHERE pl."productId" = p.id AND p."userId" = $2
        )` : 'FALSE'} as "isLiked",
        ${viewerId ? 'p."userId" = $2' : 'FALSE'} as "moderator",
        row_to_json(c) as category,
        row_to_json(cn) as condition,
        row_to_json(u) as "seller",
        (
          CASE
              WHEN b is null then null
              ELSE row_to_json(b)
          END
        ) as brand,
        (
          CASE
              WHEN city is null then null
              ELSE row_to_json(city)
          END
        ) as city,
        COALESCE(pc.colors, json '[]') as colors,
        COALESCE(pv.variants, json '[]') as variants
      FROM ${TableName.PRODUCT} AS p
      INNER JOIN LATERAL (
        SELECT json_agg(
          json_build_object(
            'sizeId',
            pv."sizeId",
            'quantity',
            pv.quantity,
            'title',
            s.title
          )
        ) as variants
          FROM ${TableName.PRODUCT_VARIANT} AS pv
          INNER JOIN ${TableName.SIZE} as s
            ON s.id = pv."sizeId"
          WHERE pv."productId" = p.id
      ) AS pv ON TRUE
      INNER JOIN LATERAL (
        SELECT json_agg(color) as colors
        FROM ${TableName.COLOR} AS color
        INNER JOIN ${TableName.PRODUCT_COLOR} as pc 
          ON pc."colorId" = color.id AND pc."productId" = p."id"
      ) AS pc ON TRUE
      INNER JOIN LATERAL (
        SELECT category.id,
            category.name,
            category.slug
        FROM ${TableName.PRODUCT_CATEGORY} AS category
        WHERE p."categoryId" = category."id"
        LIMIT 1
      ) as c ON true
      LEFT JOIN LATERAL (
          SELECT city.id,
              city.name,
              city.slug
          FROM ${TableName.CITY} AS city
          WHERE p."cityId" = city."id"
          LIMIT 1
      ) as city ON true
      INNER JOIN LATERAL (
          SELECT condition.id,
              condition.title,
              condition.description
          FROM ${TableName.PRODUCT_CONDITION} AS condition
          WHERE p."conditionId" = condition."id"
          LIMIT 1
      ) as cn ON true
      LEFT JOIN LATERAL (
        SELECT brand.id,
            brand.name
        FROM ${TableName.PRODUCT_BRAND} AS brand
        WHERE p."brandId" = brand."id"
        LIMIT 1
      ) as b ON true
      INNER JOIN LATERAL (
        SELECT seller.id,
            seller.name,
            seller.username,
            seller.picture,
            seller.phone,
            seller."lastLoggedIn",
            (
                SELECT json_build_object(
                        'count',
                        COALESCE(count(*), 0)::int,
                        'rating',
                        COALESCE(AVG(r.rating), 0)::int
                    )
                FROM ${TableName.PRODUCT_RATING} as r
                WHERE seller."id" = r."userId"
            ) as "rating",
            (
                SELECT COUNT(*)::int
                FROM ${TableName.PRODUCT} as p
                WHERE seller."id" = p."userId"
                AND p."isSold" = true
                AND p."isDeleted" = false
            ) as "productCount",
            (
                SELECT "name" 
                FROM ${TableName.CITY} as c
                WHERE seller."cityId" = c."id"
                LIMIT 1
            ) as "location"
        FROM "${TableName.USER}" AS seller
        WHERE p."userId" = seller."id"
        LIMIT 1
      ) as u ON true
      WHERE p.slug = $1
    `;
    const params: (string | number)[] = [slug];

    if (viewerId) params.push(viewerId);

    const product = await this.productRepository.query(query, params).then((rows: [ProductResponseDto]) => rows[0] || null);

    if (!product) throw new NotFoundException('Продукт не существует');

    return product;
  }

  public async createProduct(user: Payload, { sizes, colors, ...dto }: CreateProductRequestDto): Promise<ProductResponseDto> {
    return this.productRepository.manager.transaction(async (em: EntityManager) => {
      const slug = this.generateProductSlug(user.username, dto.description);
      const product = await em.save(ProductEntity, Object.assign(dto, { userId: user.userId, slug }));

      await this.size.upsertProductSizes(product.id, sizes, em);

      await this.color.upsertProductColors(product.id, colors, em);

      return product;
    });
  }

  public async updateProduct(
    productId: number,
    { userId, username }: Payload,
    { sizes, colors, ...dto }: CreateProductRequestDto,
  ): Promise<void> {
    const exists = await this.productRepository.manager.transaction(async (em: EntityManager) => {
      const slug = this.generateProductSlug(username, dto.description);
      const product = await em.update(ProductEntity, { userId, id: productId }, Object.assign(dto, { userId, slug }));

      if (product.affected === 0) {
        return false;
      }

      await this.size.upsertProductSizes(productId, sizes, em);

      await this.color.upsertProductColors(productId, colors, em);

      return true;
    });

    if (!exists) {
      throw new NotFoundException('Продукт не существует');
    }
  }

  private generateProductSlug(username: string, description: string): string {
    const MAX_LENGTH = 100;

    const slugString = slugify(description).slice(0, MAX_LENGTH);

    return `${username}-${slugString}-${new Date().getTime().toString()}`;
  }
}
