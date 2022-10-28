import type { BaseEntity } from '@/common/base.entity';

export enum PaymentStatus {
  PAID = 'paid',
  PENDING = 'pending',
  REJECTED = 'rejected',
  REFUNDED = 'refunded',
}

export enum OrderStatus {
  COMPLETED = 'completed',
  PENDING = 'pending',
  PROCESSING = 'processing',
  CANCELED = 'canceled',
}

export interface Purchase extends BaseEntity {
  productId: number;
  userId: number;
  productSizeId: number | null;
  price: number;
  serviceFee: number;
  quantity: number;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;

  shippingPrice: number;
  shippingId: number | null;
}

export interface PurchaseVariantInfoRO {
  id: number;
  price: number;
  quantity: number;
}

export interface PurchaseItem {
  productId: number;
  price: number;
  quantity: number;
  sizeId: number | null;
}
