import type { ProductImage } from '@/modules/product/interfaces/product.interface';
import { ApiProperty } from '@nestjs/swagger';

export class LikedProductResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty({ type: [] })
  images!: ProductImage[];

  @ApiProperty()
  slug!: string;

  @ApiProperty()
  price!: number;

  @ApiProperty()
  currency!: string;
}
