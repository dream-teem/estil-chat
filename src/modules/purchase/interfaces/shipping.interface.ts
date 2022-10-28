export enum ShippingStatus {
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  PENDING = 'pending',
}

export enum ShippingType {
  KAZPOST = 'kazpost',
  CDEK = 'cdek',
  CUSTOM = 'custom',
}
export interface Shipping {
  id: number;
  status: ShippingStatus;
  type: ShippingType;
  addressId: number;
  trackingNumber: string | null;
  shippedAt: Date | null;
  deliveredAt: Date | null;
}
