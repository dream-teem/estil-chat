import { Controller, Get, Query } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { SearchFilterQueryDto } from './dto/search-filter.query.dto';
import { ProductSearchService } from './product-search.service';

@Controller('search')
export class ProductSearchController {
  constructor(private readonly productSearch: ProductSearchService) {}

  @ApiResponse({ type: 'object' })
  @Get('products')
  public async searchProducts(
    @Query() filter: SearchFilterQueryDto,
  ): Promise<any[]> {
    return this.productSearch.getProducts(filter);
  }
}
