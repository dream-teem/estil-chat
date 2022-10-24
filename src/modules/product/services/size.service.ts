import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import _ from 'lodash';
import { EntityManager, Repository } from 'typeorm';

import { TableName } from '@/common/enums/table';

import type { ProductVariantDto } from '../dto/create-product.request.dto';
import type { SizeGroupResponseDto } from '../dto/size-group.response.dto';
import { ProductVariantEntity } from '../entities/product-variant.entity';
import { SizeGroupEntity } from '../entities/size-group.entity';
import { SizeEntity } from '../entities/size.entity';
import type { Size } from '../interfaces/product-size.interface';

@Injectable()
export class SizeService {
  constructor(
    @InjectRepository(SizeEntity) private sizeRepository: Repository<SizeEntity>,
    @InjectRepository(SizeGroupEntity) private sizeGroupRepository: Repository<SizeGroupEntity>,
  ) {}

  public async getSizeGroupsById(): Promise<Record<number, SizeGroupResponseDto>> {
    const sizeGroups = await this.sizeGroupRepository
      .createQueryBuilder('sg')
      .select([
        'sg.id as id',
        'sg.title as title',
        'sg.slug as slug',
        'sg."order" as "order"',
        `COALESCE(
            json_agg(
                s
                ORDER BY s."order"::int asc
            ),
            '{}'
        ) AS sizes`,
      ])
      .leftJoin(TableName.SIZE, 's', 's.sizeGroupId=sg.id')
      .groupBy('sg.id')
      .getRawMany<SizeGroupResponseDto>();

    return _.keyBy(sizeGroups, 'id');
  }

  public async getSizes(): Promise<Size[]> {
    return this.sizeRepository.find();
  }

  public async upsertProductSizes(productId: number, sizes: ProductVariantDto[], em?: EntityManager): Promise<void> {
    const values = sizes.map(({ sizeId, quantity }: ProductVariantDto) => `(${productId}, ${sizeId}, ${quantity})`).join(', ');

    const entityManager = em || this.sizeRepository.manager;

    if (_.isEmpty(sizes)) {
      await entityManager.delete(ProductVariantEntity, { productId });
      return;
    }

    await entityManager.query(
      `
      WITH deleted AS (
        DELETE FROM ${TableName.PRODUCT_VARIANT} WHERE "productId"= $1 
        ${!_.isEmpty(sizes)
    ? `AND "sizeId" NOT IN (
          ${sizes.map((_size: ProductVariantDto, index: number) => `$${index + 2}`)})
          ` : ''}
      ), pv ("productId", "sizeId", "quantity") AS (VALUES ${values})
        INSERT INTO ${TableName.PRODUCT_VARIANT} ("productId", "sizeId", "quantity")
          SELECT "productId", "sizeId", "quantity" FROM pv
        ON CONFLICT ("productId", "sizeId") 
        DO 
          UPDATE SET "quantity"=EXCLUDED."quantity"
    `,
      [productId, ..._.map(sizes, 'sizeId')],
    );
  }
}
