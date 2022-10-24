import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import _ from 'lodash';
import { EntityManager, Repository } from 'typeorm';

import { TableName } from '@/common/enums/table';

import type { ColorResponseDto } from '../dto/color.response.dto';
import { ColorEntity } from '../entities/color.entity';
import { ProductColorEntity } from '../entities/product-color.entity';

@Injectable()
export class ColorService {
  constructor(@InjectRepository(ColorEntity) private colorRepository: Repository<ColorEntity>) {}

  public async getColors(): Promise<ColorResponseDto[]> {
    return this.colorRepository.find({});
  }

  public async upsertProductColors(productId: number, colors: number[], em?: EntityManager): Promise<void> {
    const values = colors.map((colorId: number) => `(${productId}, ${colorId})`).join(', ');

    const entityManager = em || this.colorRepository.manager;

    if (_.isEmpty(colors)) {
      await entityManager.delete(ProductColorEntity, { productId });
      return;
    }

    await entityManager.query(
      `
      WITH deleted AS (
        DELETE FROM ${TableName.PRODUCT_COLOR} WHERE "productId"= $1 AND "colorId" NOT IN (
          ${colors.map((_color: number, index: number) => `$${index + 2}`)})
      ), pc ("productId", "colorId") AS (VALUES ${values})
        INSERT INTO ${TableName.PRODUCT_COLOR} ("productId", "colorId")
          SELECT "productId", "colorId" FROM pc
        ON CONFLICT ("productId", "colorId") 
        DO NOTHING
    `,
      [productId, ...colors],
    );
  }
}
