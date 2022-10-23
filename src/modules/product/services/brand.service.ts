import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import type { BrandResponseDto } from '../dto/brand.response.dto';
import { ProductBrandEntity } from '../entities/product-brand.entity';

@Injectable()
export class BrandService {
  constructor(@InjectRepository(ProductBrandEntity) private brandRepository: Repository<ProductBrandEntity>) {}

  public async getBrands(): Promise<BrandResponseDto[]> {
    return this.brandRepository.find({
      order: {
        name: 'ASC',
      },
    });
  }
}
