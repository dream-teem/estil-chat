export interface PayboxRequestCommonParams {
  pg_merchant_id: string;
}

export enum PayboxScriptName {
  INIT_PAYMENT = 'init_payment.php',
  REVOKE = 'revoke.php',
}

export interface PayboxParams {
  pg_order_id?: string;
  pg_merchant_id?: string;
  pg_amount?: string;
  pg_description?: string;
  pg_currency?: string;
  pg_check_url?: string;
  pg_result_url?: string;
  pg_request_method?: string;
  pg_testing_mode?: string;
  pg_user_id?: string;
  pg_receipt_positions?: string;
  pg_recurring_lifetime?: string;
  pg_recurring_start?: string;
  pg_language?: 'ru' | 'en';
  pg_postpone_payment?: string;
  pg_user_ip?: string;
  pg_user_contact_email?: string;
  pg_user_phone?: string;
  pg_lifetime?: string;
  pg_payment_system?: 'EPAYWEBKZT';
  pg_site_url?: string;
  pg_state_url_method?: 'GET' | 'POST';
  pg_status_url?: string;
  pg_failure_url_method?: 'GET' | 'POST';
  pg_success_url?: string;
  pg_param1?: string;
  pg_param2?: string;
  pg_param3?: string;
  pg_salt?: string;
  pg_sig?: string;
  pg_payment_route?: string;
}

export type PayboxResponseStatus = 'ok' | 'error';

export interface PayboxInitPaymentParams {
  pg_order_id: string;
  pg_amount: string;
  pg_user_id?: string;
  pg_payment_route?: string;
}

export interface PayboxRevokePaymentParams {
  pg_payment_id: string;
  pg_refund_amount: string;
}

export interface PayboxInitPaymentResponse {
  pg_payment_id: string;
  pg_redirect_url: string;
  pg_redirect_url_type: string;
  pg_salt: string;
  pg_sig: string;
  pg_status: PayboxResponseStatus;
}

export interface PayboxRevokePaymentResponse {
  pg_status: PayboxResponseStatus;
  pg_error_code: string;
  pg_error_description: string;
  pg_salt: string;
  pg_sig: string;
}

export interface PayboxWebhookResponse {
  pg_status: 'ok' | 'rejected';
  pg_description: string;
  pg_sig: string;
  pg_salt: string;
}

export type PayboxParamsWithSignature<T = any> = T & {
  pg_sig: string;
  pg_salt: string;
};
