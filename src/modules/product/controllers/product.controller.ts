import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { ReqUser } from '@/common';
import { UseAuth } from '@/common/decorators/auth.decorator';
import { UseCache } from '@/common/decorators/cache.decorator';
import type { Payload } from '@/modules/auth';

import type { AggregatedCategoryResponseDto } from '../dto/aggregated-category.response.dto';
import { BrandResponseDto } from '../dto/brand.response.dto';
import { CategoryTreeResponseDto } from '../dto/category-tree.response.dto';
import { ColorResponseDto } from '../dto/color.response.dto';
import { ConditionResponseDto } from '../dto/condition.response.dto';
import { CreateProductRequestDto } from '../dto/create-product.request.dto';
import type { SizeGroupResponseDto } from '../dto/size-group.response.dto';
import { BrandService } from '../services/brand.service';
import { CategoryService } from '../services/category.service';
import { ColorService } from '../services/color.service';
import { ConditionService } from '../services/condition.service';
import { ProductService } from '../services/product.service';
import { SizeService } from '../services/size.service';

@Controller('products')
export class ProductController {
  constructor(
    private readonly category: CategoryService,
    private readonly size: SizeService,
    private readonly color: ColorService,
    private readonly condition: ConditionService,
    private readonly brand: BrandService,
    private readonly product: ProductService,
  ) {}

  @UseCache()
  @ApiResponse({ type: [CategoryTreeResponseDto] })
  @Get('attributes/categories/tree')
  public async getCategoryTree(): Promise<CategoryTreeResponseDto[]> {
    return this.category.getCategoriesTree();
  }

  @UseCache()
  @ApiResponse({ type: 'object' })
  @Get('attributes/categories/byId')
  public async getCategoriesById(): Promise<Record<number, AggregatedCategoryResponseDto>> {
    return this.category.getCategoriesById();
  }

  @UseCache()
  @ApiResponse({ type: 'object' })
  @Get('attributes/sizeGroups/byId')
  public async getSizeGroupsById(): Promise<Record<number, SizeGroupResponseDto>> {
    return this.size.getSizeGroupsById();
  }

  @UseCache()
  @ApiResponse({ type: [ColorResponseDto] })
  @Get('attributes/colors')
  public async getColors(): Promise<ColorResponseDto[]> {
    return this.color.getColors();
  }

  @UseCache()
  @ApiResponse({ type: [ConditionResponseDto] })
  @Get('attributes/conditions')
  public async getConditions(): Promise<ConditionResponseDto[]> {
    return this.condition.getConditions();
  }

  @UseCache()
  @ApiResponse({ type: [BrandResponseDto] })
  @Get('attributes/brands')
  public async getBrands(): Promise<BrandResponseDto[]> {
    return this.brand.getBrands();
  }

  @UseAuth()
  @Post('')
  public async createProduct(@Body() dto: CreateProductRequestDto, @ReqUser() user: Payload): Promise<void> {
    return this.product.createProduct(user, dto);
  }

  @UseAuth()
  @Put(':id')
  public async updateProduct(@Param('id') id: number, @Body() dto: CreateProductRequestDto, @ReqUser() user: Payload): Promise<void> {
    return this.product.updateProduct(id, user, dto);
  }
}
