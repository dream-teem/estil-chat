import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';

import { ConfigService } from '@/common';

import { ProductSearchController } from './product-search.controller';
import { ProductSearchService } from './product-search.service';

@Module({
  imports: [ElasticsearchModule.registerAsync({
    useFactory: (config: ConfigService) => ({
      node: config.get('elastic.node'),
    }),
    inject: [ConfigService],
  })],
  controllers: [ProductSearchController],
  providers: [ProductSearchService],
  exports: [],
})
export class ProductSearchModule {}
