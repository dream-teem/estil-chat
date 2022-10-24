import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';

import { ProductController } from './controllers/product.controller';
import { ColorEntity } from './entities/color.entity';
import { ProductBrandEntity } from './entities/product-brand.entity';
import { ProductCategoryEntity } from './entities/product-category.entity';
import { ProductColorEntity } from './entities/product-color.entity';
import { ProductConditionEntity } from './entities/product-condition.entity';
import { ProductVariantEntity } from './entities/product-variant.entity';
import { ProductEntity } from './entities/product.entity';
import { SizeGroupEntity } from './entities/size-group.entity';
import { SizeEntity } from './entities/size.entity';
import { BrandService } from './services/brand.service';
import { CategoryService } from './services/category.service';
import { ColorService } from './services/color.service';
import { ConditionService } from './services/condition.service';
import { ProductService } from './services/product.service';
import { SizeService } from './services/size.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductEntity,
      ProductCategoryEntity,
      ProductBrandEntity,
      ProductConditionEntity,
      ProductColorEntity,
      ColorEntity,
      SizeEntity,
      SizeGroupEntity,
      ProductVariantEntity,
    ]),
  ],
  controllers: [ProductController],
  providers: [CategoryService, SizeService, ColorService, ConditionService, BrandService, ProductService],
  exports: [],
})
export class ProductModule {}
