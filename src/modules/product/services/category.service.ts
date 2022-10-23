import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import _, { uniq } from 'lodash';
import { Repository } from 'typeorm';

import type { AggregatedCategoryResponseDto } from '../dto/aggregated-category.response.dto';
import type { CategoryTreeResponseDto } from '../dto/category-tree.response.dto';
import type { CategoryResponseDto } from '../dto/category.response.dto';
import { ProductCategoryEntity } from '../entities/product-category.entity';

@Injectable()
export class CategoryService {
  constructor(@InjectRepository(ProductCategoryEntity) private categoryRepository: Repository<ProductCategoryEntity>) {}

  public async getCategoriesTree(): Promise<CategoryTreeResponseDto[]> {
    // flat list each element with empty subCategories
    const categories = await this.categoryRepository
      .createQueryBuilder('c')
      .select(['id', 'name', '"order"', '"parentId"', 'path', '"sizeGroupId"', 'slug', '\'[]\'::jsonb as "subCategories"'])
      .getRawMany<CategoryResponseDto>();

    // group by parent id, if parent id is null => map to *parentCategoryKey*
    const parentCategoryKey = 'parent';
    const groupedByParent = _.groupBy(categories, (category: CategoryResponseDto) => category.parentId ?? parentCategoryKey);

    const parentCategories = groupedByParent[parentCategoryKey];
    return this.aggregateCategoriesTree(groupedByParent, parentCategories);
  }

  public async getCategoriesById(): Promise<Record<number, AggregatedCategoryResponseDto>> {
    const categoriesTree = await this.getCategoriesTree();

    return this.flattenCategoryTree(categoriesTree).reduce(
      (prev: Record<string, AggregatedCategoryResponseDto>, category: AggregatedCategoryResponseDto) => {
        prev[category.id] = category;
        return prev;
      },
      <Record<string, AggregatedCategoryResponseDto>>{},
    );
  }

  /**
   * Recursively iterates through category array and build tree
   * @param categoriesGroupedByParent
   * @param parentCategories
   * @returns category tree
   */
  private aggregateCategoriesTree(
    categoriesGroupedByParent: Record<number, CategoryResponseDto[]>,
    parentCategories?: CategoryResponseDto[],
  ): CategoryTreeResponseDto[] {
    if (!parentCategories) return [];

    return parentCategories.map((category: CategoryResponseDto) => {
      const subCategories = this.aggregateCategoriesTree(categoriesGroupedByParent, categoriesGroupedByParent[category.id]);
      const sizeGroups = subCategories.reduce(
        (prev: number[], { sizeGroups: subSizeGroups }: CategoryTreeResponseDto) => [...prev, ...subSizeGroups],
        category.sizeGroupId ? [category.sizeGroupId] : [],
      );

      return {
        ..._.omit(category, 'sizeGroupId'),
        subCategories,
        sizeGroups: uniq(sizeGroups),
      };
    });
  }

  /**
   * Flattens category tree
   * @param categoryTree
   * @returns flat category with aggregated values
   */
  private flattenCategoryTree(categoryTree: CategoryTreeResponseDto[]): AggregatedCategoryResponseDto[] {
    return categoryTree.flatMap((category: CategoryTreeResponseDto) => {
      const subCategories = this.flattenCategoryTree(category.subCategories);

      const aggregatedCategory = {
        ...category,
        subCategories: category.subCategories.map(({ id }: CategoryTreeResponseDto) => id),
      };

      return [aggregatedCategory, ...subCategories];
    });
  }
}
