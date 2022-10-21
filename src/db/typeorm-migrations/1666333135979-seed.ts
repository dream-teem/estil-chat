import { TableName } from '@/common/interfaces/table';
import { CityEntity } from '@/modules/cities/city.entity';
import { ColorEntity } from '@/modules/product/entities/color.entity';
import { ProductBrandEntity } from '@/modules/product/entities/product-brand.entity';
import { ProductCategoryEntity } from '@/modules/product/entities/product-category.entity';
import { ProductConditionEntity } from '@/modules/product/entities/product-condition.entity';
import { SizeGroupEntity } from '@/modules/product/entities/size-group.entity';
import { SizeEntity } from '@/modules/product/entities/size.entity';
import { In, MigrationInterface, QueryRunner } from 'typeorm';
import { fixSequence } from '../fixtures/utils';

const conditionFixture: ProductConditionEntity[] = require('../fixtures/condition.json');
const categoryFixture: ProductCategoryEntity[] = require('../fixtures/category.json');
const sizeFixture: SizeEntity[] = require('../fixtures/size.json');
const sizeGroupFixture: SizeGroupEntity[] = require('../fixtures/sizeGroup.json');
const brandFixture: ProductBrandEntity[] = require('../fixtures/brand.json');
const colorFixture: ColorEntity[] = require('../fixtures/color.json');
const cityFixture: CityEntity[] = require('../fixtures/city.json');

export class seed1666333135979 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.insert(SizeGroupEntity, sizeGroupFixture);

    await queryRunner.manager.insert(SizeEntity, sizeFixture);

    await queryRunner.manager.insert(ProductCategoryEntity, categoryFixture);

    await queryRunner.manager.insert(ProductConditionEntity, conditionFixture);

    await queryRunner.manager.insert(ProductBrandEntity, brandFixture);

    await queryRunner.manager.insert(ColorEntity, colorFixture);

    await queryRunner.manager.insert(CityEntity, cityFixture);

    await fixSequence(queryRunner, [
      TableName.SIZE_GROUP,
      TableName.SIZE,
      TableName.PRODUCT_CATEGORY,
      TableName.PRODUCT_CONDITION,
      TableName.PRODUCT_BRAND,
      TableName.COLOR,
      TableName.CITY,
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.delete(SizeGroupEntity, { id: In(sizeGroupFixture.map(({ id }) => id)) });
    await queryRunner.manager.delete(SizeEntity, { id: In(sizeFixture.map(({ id }) => id)) });
    await queryRunner.manager.delete(ProductCategoryEntity, { id: In(categoryFixture.map(({ id }) => id)) });
    await queryRunner.manager.delete(ProductConditionEntity, { id: In(conditionFixture.map(({ id }) => id)) });
    await queryRunner.manager.delete(ProductBrandEntity, { id: In(brandFixture.map(({ id }) => id)) });
    await queryRunner.manager.delete(ColorEntity, { id: In(colorFixture.map(({ id }) => id)) });
    await queryRunner.manager.delete(CityEntity, { id: In(cityFixture.map(({ id }) => id)) });
  }
}
