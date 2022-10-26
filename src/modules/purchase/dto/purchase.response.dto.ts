import { ApiProperty } from '@nestjs/swagger';
import type { DeliveryStatus, Purchase, PurchaseStatus } from '../interfaces/purchase.interface';

export class PurchaseResponseDto implements Purchase {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  productId!: number;

  @ApiProperty()
  userId!: number;

  @ApiProperty()
  addressId!: number | null;

  @ApiProperty()
  productSizeId!: number | null;

  @ApiProperty()
  price!: number;

  @ApiProperty()
  deliveryPrice!: number;

  @ApiProperty()
  quantity!: number;

  @ApiProperty()
  status!: PurchaseStatus;

  @ApiProperty()
  deliveryStatus!: DeliveryStatus | null;

  @ApiProperty()
  trackingNumber!: string | null;

  @ApiProperty()
  shippedAt!: Date | null;

  @ApiProperty()
  deliveredAt!: Date | null;

  @ApiProperty()
  createdAt!: string;

  @ApiProperty()
  updatedAt!: string;
}
