import type { BaseEntity } from '@/common/base.entity';

export enum PurchaseStatus {
  COMPLETED = 'completed',
  IN_PROGRESS = 'in_progress',
}

export enum DeliveryStatus {
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  PENDING = 'pending',
}

export interface Purchase extends BaseEntity {
  productId: number;
  userId: number;
  addressId: number | null;
  productSizeId: number | null;
  price: number;
  deliveryPrice: number;
  quantity: number;
  status: PurchaseStatus;
  deliveryStatus: DeliveryStatus | null;
  trackingNumber: string | null;
  shippedAt: Date | null;
  deliveredAt: Date | null;
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
