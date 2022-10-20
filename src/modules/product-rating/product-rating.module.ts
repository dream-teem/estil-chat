import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';

import { ProductRatingEntity } from './product-rating.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductRatingEntity,
    ]),
  ],
  providers: [],
  exports: [],
})
export class ProductRatingModule {}
