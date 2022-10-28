import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { EntityManager, Repository } from 'typeorm';

import { TableName } from '@/common/enums/table';
import { UtilService } from '@/common/providers/util.service';
import type { Payload } from '@/modules/auth/auth.interface';
import { ProductEntity } from '@/modules/product/entities/product.entity';

import type { CreatePurchaseResponseDto } from '../dto/create-purchase.response.dto';
import type { PayboxResultRequestDto } from '../dto/paybox-result.request.dto';
import type { PurchaseProductRequestDto } from '../dto/purchase-product.request.dto';
import type { PurchaseResponseDto } from '../dto/purchase.response.dto';
import { PurchaseEntity } from '../entities/purchase.entity';
import { OrderStatus, PaymentStatus, Purchase, PurchaseItem, PurchaseVariantInfoRO } from '../interfaces/purchase.interface';
import { PayboxChargeService } from './paybox-charge.service';

@Injectable()
export class PurchaseService {
  /**
   * Service fee in fraction
   */
  private SERVICE_FEE: number = 0.1;

  constructor(
    @InjectRepository(PurchaseEntity) private purchaseRepository: Repository<PurchaseEntity>,
    private readonly payboxCharge: PayboxChargeService,
    private readonly utils: UtilService,
  ) {}

  public async getPurchasesByUserId(userId: number): Promise<PurchaseResponseDto[]> {
    return this.purchaseRepository.find({ where: { userId } });
  }

  public async purchaseProduct(
    user: Payload,
    { productId, sizeId, quantity, total }: PurchaseProductRequestDto,
  ): Promise<CreatePurchaseResponseDto> {
    return this.purchaseRepository.manager.transaction<CreatePurchaseResponseDto>(
      async (em: EntityManager): Promise<CreatePurchaseResponseDto> => {
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

        const { total: recountedTotal, serviceFee } = this.recountTotal([{ price: product.price, quantity }]);

        if (recountedTotal !== total) {
          return Promise.reject(new BadRequestException('Некоторые продукты закончились или же поменялись в цене'));
        }

        const purchase = await em.getRepository(PurchaseEntity).save({
          productId,
          productSizeId: sizeId,
          userId: user.userId,
          price: recountedTotal,
          quantity,
          serviceFee,
        });

        const chargeUrl = await this.payboxCharge.createCharge(em, purchase.id, {
          pg_amount: String(purchase.price),
          pg_order_id: String(purchase.id),
          pg_user_id: String(purchase.userId),
        });

        await this.decrementQuantity(em, [{ productId: product.id, price: product.price, quantity, sizeId }]);

        return { chargeUrl };
      },
    );
  }

  public async processSuccessfulPayment(em: EntityManager, data: PayboxResultRequestDto): Promise<void> {
    const result = await em
      .getRepository(PurchaseEntity)
      .createQueryBuilder('p')
      .update({
        paymentStatus: PaymentStatus.PAID,
        orderStatus: OrderStatus.PROCESSING,
      })
      .where('"orderStatus" = :orderStatus', { orderStatus: OrderStatus.PENDING })
      .andWhere('id = :id', { id: data.pg_order_id })
      .execute();

    if (!result.affected) {
      throw new BadRequestException('Покупка не существует');
    }
  }

  public async processFailedPayment(em: EntityManager, data: PayboxResultRequestDto): Promise<void> {
    const result = await em
      .getRepository(PurchaseEntity)
      .createQueryBuilder('p')
      .update({
        paymentStatus: PaymentStatus.REJECTED,
        orderStatus: OrderStatus.CANCELED,
      })
      .where('"orderStatus" = :orderStatus', { orderStatus: OrderStatus.PENDING })
      .andWhere('id = :id', { id: data.pg_order_id })
      .returning('*')
      .execute();

    if (!result.affected) {
      throw new BadRequestException('Покупка не существует');
    }

    const purchase = <Purchase>result.raw[0];

    await this.incrementQuantity(em, [
      { productId: purchase.productId, sizeId: purchase.productSizeId, price: purchase.price, quantity: purchase.quantity },
    ]);
  }

  private recountTotal(products: Pick<PurchaseItem, 'price' | 'quantity'>[]): Record<'total' | 'serviceFee', number> {
    const itemTotal = products.reduce(
      (total: number, product: Pick<PurchaseItem, 'price' | 'quantity'>) => (
        total + this.utils.normalizeNumber(product.price) * product.quantity
      ),
      0,
    );

    const serviceFee = itemTotal * this.SERVICE_FEE;

    return { total: itemTotal + serviceFee, serviceFee };
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

  private async incrementQuantity(em: EntityManager, products: PurchaseItem[]): Promise<void> {
    const values = products.map((item: PurchaseItem) => `(${item.productId}, ${item.quantity}, ${item.sizeId || 'null'})`).join(', ');

    await em.getRepository(ProductEntity).query(`
        WITH values ("productId", "quantity", "sizeId") AS (VALUES ${values}),
        increment_variants as (
            UPDATE ${TableName.PRODUCT_VARIANT} as pv SET quantity = pv.quantity + c.quantity
            FROM (
                SELECT "productId", "quantity", "sizeId" FROM values WHERE "sizeId" IS NOT NULL
            ) as c("productId", "quantity", "sizeId")
            WHERE c."productId" = pv."productId" AND c."sizeId"::int = pv."sizeId"
        )
        UPDATE ${TableName.PRODUCT} as p SET quantity = p.quantity + c.quantity
            FROM (
                SELECT "productId", "quantity", "sizeId" FROM values WHERE "sizeId" IS NULL
            ) as c("productId", "quantity", "sizeId")
            WHERE c."productId" = p.id
    `);
  }
}
