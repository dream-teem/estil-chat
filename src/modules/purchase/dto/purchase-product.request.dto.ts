import { IsNumber, IsOptional } from 'class-validator';

export class PurchaseProductRequestDto {
  @IsNumber()
  productId!: number;

  @IsNumber()
  total!: number;

  @IsNumber()
  @IsOptional()
  sizeId!: number | null;

  @IsNumber()
  quantity!: number;

  @IsNumber()
  @IsOptional()
  addressId?: number | null;
}
