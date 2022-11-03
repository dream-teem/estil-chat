import type { PurchaseItem } from '@/modules/purchase/interfaces/purchase.interface';

export interface ProductQuantity extends Pick<PurchaseItem, 'productId' | 'quantity' | 'sizeId'> {}
