import { ApiProperty } from '@nestjs/swagger';
import type { ProductCurrency, ProductImage, ProductThumbnails } from '../interfaces/product.interface';

class ProductImageThumbnailsDto implements ProductThumbnails {
  @ApiProperty()
  150!: string;

  @ApiProperty()
  310!: string;

  @ApiProperty()
  428!: string;

  @ApiProperty()
  624!: string;

  @ApiProperty()
  1280!: string;
}

class ProductImageResponseDto {
  @ApiProperty()
  original!: string;

  @ApiProperty({ type: ProductImageThumbnailsDto })
  thumbnails!: ProductThumbnails;
}

export class ProductResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  description!: string;

  @ApiProperty()
  slug!: string;

  @ApiProperty()
  userId!: number;

  @ApiProperty()
  brandId!: number | null;

  @ApiProperty()
  categoryId!: number;

  @ApiProperty()
  cityId!: number;

  @ApiProperty({ type: [ProductImageResponseDto] })
  images!: ProductImage[];

  @ApiProperty()
  conditionId!: number;

  @ApiProperty()
  price!: number;

  @ApiProperty()
  quantity!: number | null;

  @ApiProperty()
  promoted!: boolean;

  @ApiProperty()
  currency!: ProductCurrency;

  @ApiProperty()
  isDeleted!: boolean;

  @ApiProperty()
  isSold!: boolean;

  @ApiProperty()
  createdAt!: string;

  @ApiProperty()
  updatedAt!: string;
}
