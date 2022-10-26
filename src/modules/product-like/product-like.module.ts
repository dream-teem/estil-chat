import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';

import { ProductLikeController } from './product-like.controller';
import { ProductLikeEntity } from './product-like.entity';
import { ProductLikeService } from './product-like.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductLikeEntity])],
  controllers: [ProductLikeController],
  providers: [ProductLikeService],
  exports: [],
})
export class ProductLikeModule {}
