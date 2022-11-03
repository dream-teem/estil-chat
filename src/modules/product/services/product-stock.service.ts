import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { TableName } from '@/common/enums/table';

import { ProductEntity } from '../entities/product.entity';
import type { ProductQuantity } from '../interfaces/product-stock.interface';

@Injectable()
export class ProductStockService {
  constructor(@InjectRepository(ProductEntity) private readonly productRepository: Repository<ProductEntity>) {}

  public async registerProductPurchase(products: ProductQuantity[], em?: EntityManager): Promise<void> {
    return this.correctProductsQty(products, '-', em);
  }

  public async revertProductPurchase(products: ProductQuantity[], em?: EntityManager): Promise<void> {
    return this.correctProductsQty(products, '+', em);
  }

  private async correctProductsQty(qtys: ProductQuantity[], operator: '-' | '+', em?: EntityManager): Promise<void> {
    const entityManager = em || this.productRepository.manager;
    const values = qtys.map((item: ProductQuantity) => `(${item.productId}, ${item.quantity}, ${item.sizeId || 'null'})`).join(', ');

    await entityManager.query(`
        WITH qtys ("productId", "quantity", "sizeId") AS (VALUES ${values}),
        correct_size_qtys as (
            UPDATE ${TableName.PRODUCT_VARIANT} as pv SET quantity = pv.quantity ${operator} c.quantity
                FROM (
                    SELECT "productId", "quantity", "sizeId" FROM qtys WHERE "sizeId" IS NOT NULL
                ) as c("productId", "quantity", "sizeId")
            WHERE c."productId" = pv."productId" AND c."sizeId"::int = pv."sizeId"
                RETURNING pv."quantity"
        )
        UPDATE ${TableName.PRODUCT} as p SET quantity = p.quantity ${operator} c.quantity
            FROM (
                SELECT "productId", "quantity", "sizeId" FROM qtys WHERE "sizeId" IS NULL
            ) as c("productId", "quantity", "sizeId")
        WHERE c."productId" = p.id
            RETURNING p."quantity"
    `);
  }
}
