import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, ValidateNested, ArrayMinSize, ArrayMaxSize, IsNumber, IsOptional, IsArray, IsCurrency, IsNotEmpty } from 'class-validator';
import type { ProductCurrency, ProductThumbnails } from '../interfaces/product.interface';

class ProductImageThumbnailsDto implements ProductThumbnails {
  @ApiProperty()
  @IsString()
  150!: string;

  @ApiProperty()
  @IsString()
  310!: string;

  @ApiProperty()
  @IsString()
  428!: string;

  @ApiProperty()
  @IsString()
  624!: string;

  @ApiProperty()
  @IsString()
  1280!: string;
}

class ProductImageDto {
  @ApiProperty()
  @IsString()
  original!: string;

  @ApiProperty({ type: ProductImageThumbnailsDto })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ProductImageThumbnailsDto)
  thumbnails!: ProductImageThumbnailsDto;
}

export class ProductVariantDto {
  @ApiProperty()
  @IsNumber()
  sizeId!: number;

  @ApiProperty()
  @IsNumber()
  quantity!: number;
}

export class CreateProductRequestDto {
  @ApiProperty()
  @IsString()
  description!: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  brandId!: number | null;

  @ApiProperty()
  @IsNumber()
  categoryId!: number;

  @ApiProperty()
  @IsNumber()
  cityId!: number;

  @ApiProperty({ type: [ProductImageDto] })
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(4)
  @Type(() => ProductImageDto)
  images!: ProductImageDto[];

  @ApiProperty()
  @IsNumber()
  conditionId!: number;

  @ApiProperty()
  @IsNumber()
  price!: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  quantity!: number | null;

  @ApiProperty()
  @IsOptional()
  @IsCurrency()
  currency?: ProductCurrency;

  @IsArray()
  @ArrayMinSize(0)
  @ArrayMaxSize(3)
  @IsNumber({}, { each: true })
  colors!: number[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ProductVariantDto)
  sizes!: ProductVariantDto[];
}
