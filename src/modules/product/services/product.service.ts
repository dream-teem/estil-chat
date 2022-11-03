import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import slugify from 'slugify';
import { EntityManager, Repository } from 'typeorm';

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

  public async getProductBySlug(slug: string): Promise<ProductResponseDto | null> {
    return this.productRepository.findOne({ where: { slug } });
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
