import type { PayboxResultRequestDto } from '../dto/paybox-result.request.dto';
import type { PaymentMethodType } from './payment-method.interface';

export type PayboxWebhookData =
  | { type: PayboxWebhookType.CHARGE; data: PayboxResultRequestDto }
  | { type: PayboxWebhookType.CHECK; data: PayboxCheckWebhookParams };

export enum PayboxWebhookType {
  CHECK = 'check',
  CHARGE = 'charge',
}

export interface PayboxCheckWebhookParams {
  pg_order_id: string;
  pg_merchant_id: string;
  pg_amount: string;
  pg_description: string;
  pg_currency: string;
  pg_ps_currency: string;
  pg_ps_amount: string;
  pg_ps_full_amount: string;
  pg_salt: string;
  pg_sig: string;
}

export interface PayboxChargeWebhookParams {
  pg_order_id: string;
  pg_payment_id: string;
  pg_amount: string;
  pg_currency: string;
  pg_net_amount: string;
  pg_ps_amount: string;
  pg_ps_full_amount: string;
  pg_ps_currency: string;
  pg_description: string;
  pg_result: '0' | '1';
  pg_payment_date: Date;
  pg_can_reject: '0' | '1';
  pg_user_phone?: string;
  pg_user_contact_email?: string;
  pg_testing_mode: '0' | '1';
  pg_captured: '0' | '1';
  pg_card_id: number;
  pg_card_pan: string;
  pg_salt: string;
  pg_sig: string;
  pg_payment_method: PaymentMethodType;
  pg_card_exp: string;
  pg_card_owner: string;
  pg_card_brand: string;
}
export interface PayboxResponse<T=any> {
  response: T;
}
