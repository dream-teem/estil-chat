import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { EntityManager, Repository } from 'typeorm';

import { TableName } from '@/common/enums/table';
import { UtilService } from '@/common/providers/util.service';

import type { Payload } from '../auth/auth.interface';
import { ProductEntity } from '../product/entities/product.entity';
import type { PurchaseProductRequestDto } from './dto/purchase-product.request.dto';
import type { PurchaseResponseDto } from './dto/purchase.response.dto';
import { PurchaseEntity } from './entities/purchase.entity';
import { PurchaseItem, PurchaseStatus, PurchaseVariantInfoRO } from './interfaces/purchase.interface';

@Injectable()
export class PurchaseService {
  constructor(
    @InjectRepository(PurchaseEntity) private purchaseRepository: Repository<PurchaseEntity>,
    private readonly utils: UtilService,
  ) {}

  public async getPurchasesByUserId(userId: number): Promise<PurchaseResponseDto[]> {
    return this.purchaseRepository.find({ where: { userId } });
  }

  public async purchaseProduct(user: Payload, { productId, sizeId, quantity, total }: PurchaseProductRequestDto): Promise<void> {
    await this.purchaseRepository.manager.transaction(async (em: EntityManager): Promise<void> => {
      const query = em
        .getRepository(ProductEntity)
        .createQueryBuilder('p')
        .select(['p.id as id', 'p.price as price'])
        .setLock('pessimistic_write')
        .where('p.id = :productId', { productId })
        .andWhere('p.isSold = false')
        .andWhere('p.isDeleted = false');

      if (sizeId) {
        query
          .addSelect(['pv.quantity as quantity'])
          .innerJoin(TableName.PRODUCT_VARIANT, 'pv', 'pv.productId = p.id')
          .andWhere('pv.quantity >= :quantity', { quantity });
      } else {
        query.addSelect('p.quantity as quantity').andWhere('p.quantity >= :quantity', { quantity });
      }

      const product = await query.getRawOne<PurchaseVariantInfoRO>();

      if (!product) {
        return Promise.reject(new BadRequestException('Продукт не найден или закончился'));
      }

      const recountedTotal = this.recountTotal([{ price: product.price, quantity }]);

      if (recountedTotal !== total) {
        return Promise.reject(new BadRequestException('Некоторые продукты закончились или же поменялись в цене'));
      }

      await em.getRepository(PurchaseEntity).save({
        productId,
        productSizeId: sizeId,
        userId: user.userId,
        price: recountedTotal,
        quantity,
        status: PurchaseStatus.COMPLETED,
      });

      await this.decrementQuantity(em, [{ productId: product.id, price: product.price, quantity, sizeId }]);
    });
  }

  private recountTotal(products: Pick<PurchaseItem, 'price' | 'quantity'>[]): number {
    return products.reduce(
      (total: number, product: Pick<PurchaseItem, 'price' | 'quantity'>) => (
        total + this.utils.normalizeNumber(product.price) * product.quantity
      ),
      0,
    );
  }

  private async decrementQuantity(em: EntityManager, products: PurchaseItem[]): Promise<void> {
    const values = products.map((item: PurchaseItem) => `(${item.productId}, ${item.quantity}, ${item.sizeId || 'null'})`).join(', ');

    await em.getRepository(ProductEntity).query(`
        WITH values ("productId", "quantity", "sizeId") AS (VALUES ${values}),
        decrement_variants as (
            UPDATE ${TableName.PRODUCT_VARIANT} as pv SET quantity = pv.quantity - c.quantity
            FROM (
                SELECT "productId", "quantity", "sizeId" FROM values WHERE "sizeId" IS NOT NULL
            ) as c("productId", "quantity", "sizeId")
            WHERE c."productId" = pv."productId" AND c."sizeId"::int = pv."sizeId"
        )
        UPDATE ${TableName.PRODUCT} as p SET quantity = p.quantity - c.quantity
            FROM (
                SELECT "productId", "quantity", "sizeId" FROM values WHERE "sizeId" IS NULL
            ) as c("productId", "quantity", "sizeId")
            WHERE c."productId" = p.id
    `);
  }
}
