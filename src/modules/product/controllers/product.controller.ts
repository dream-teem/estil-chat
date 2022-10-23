import { Controller, Get } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { UseCache } from '@/common/decorators/cache.decorator';

import type { AggregatedCategoryResponseDto } from '../dto/aggregated-category.response.dto';
import { BrandResponseDto } from '../dto/brand.response.dto';
import { CategoryTreeResponseDto } from '../dto/category-tree.response.dto';
import { ColorResponseDto } from '../dto/color.response.dto';
import { ConditionResponseDto } from '../dto/condition.response.dto';
import type { SizeGroupResponseDto } from '../dto/size-group.response.dto';
import { BrandService } from '../services/brand.service';
import { CategoryService } from '../services/category.service';
import { ColorService } from '../services/color.service';
import { ConditionService } from '../services/condition.service';
import { SizeService } from '../services/size.service';

@Controller('products')
export class ProductController {
  constructor(
    private category: CategoryService,
    private size: SizeService,
    private color: ColorService,
    private readonly condition: ConditionService,
    private readonly brand: BrandService,
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
}
