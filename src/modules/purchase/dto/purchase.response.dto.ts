import { ApiProperty } from '@nestjs/swagger';
import type {  Purchase, PaymentStatus, OrderStatus } from '../interfaces/purchase.interface';

export class PurchaseResponseDto implements Purchase {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  productId!: number;

  @ApiProperty()
  userId!: number;

  @ApiProperty()
  productSizeId!: number | null;

  @ApiProperty()
  price!: number;

  @ApiProperty()
  serviceFee!: number;

  @ApiProperty()
  quantity!: number;

  @ApiProperty()
  paymentStatus!: PaymentStatus;
  
  @ApiProperty()
  orderStatus!: OrderStatus;

  @ApiProperty()
  shippingPrice!: number;
  
  @ApiProperty()
  shippingId!: number | null;

  @ApiProperty()
  createdAt!: string;

  @ApiProperty()
  updatedAt!: string;
}
