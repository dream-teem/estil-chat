import { PaginationQueryDto } from '@/common/dto/pagination.query.dto';
import { Transform } from 'class-transformer';
import { IsOptional, IsString,  IsNumber, IsBoolean, IsEnum } from 'class-validator';
import _ from 'lodash';

export enum SortType {
  RELEVANCE = 'relevance',
  PRICE_MIN = 'priceMin',
  PRICE_MAX = 'priceMax',
  RECENT = 'recent',
}

export class SearchFilterQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  username!: string;

  @IsOptional()
  @IsNumber({}, { each: true })
  @Transform(({ value }) => _.map(value, Number))
  categories?: number[];

  @IsOptional()
  @IsNumber({}, { each: true })
  @Transform(({ value }) => _.map(value, Number))
  brands?: number[];

  @IsOptional()
  @IsNumber({}, { each: true })
  @Transform(({ value }) => _.map(value, Number))
  colors?: number[];

  @IsOptional()
  @IsNumber({}, { each: true })
  @Transform(({ value }) => _.map(value, Number))
  conditions?: number[];

  @IsOptional()
  @IsNumber({}, { each: true })
  @Transform(({ value }) => _.map(value, Number))
  sizes?: number[];

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  minPrice?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  maxPrice?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  city?: number;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  isSold?: boolean;

  @IsEnum(SortType)
  @IsOptional()
  sort?: SortType;

  @IsString()
  @IsOptional()
  search?: string;
}
