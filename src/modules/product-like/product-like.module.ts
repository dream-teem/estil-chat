import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';

import { ProductLikeEntity } from './product-like.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductLikeEntity,
    ]),
  ],
  providers: [],
  exports: [],
})
export class ProductLikeModule {}
