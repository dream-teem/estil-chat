import { IsNotEmpty,  IsNumberString, IsOptional, IsString } from 'class-validator';
import type { PaymentMethodType } from '../interfaces/payment-method.interface';

export class PayboxResultRequestDto {
  @IsNumberString()
  pg_order_id!: string;

  @IsString()
  pg_payment_id!: string;

  @IsNumberString()
  pg_amount!: string;

  @IsString()
  pg_currency!: string;

  @IsNumberString()
  pg_net_amount!: string;

  @IsNumberString()
  pg_ps_amount!: string;

  @IsNumberString()
  pg_ps_full_amount!: string;

  @IsString()
  pg_ps_currency!: string;

  @IsString()
  pg_description!: string;

  @IsString()
  pg_result!: "0" | "1";

  @IsString()
  pg_payment_date!: Date;

  @IsString()
  pg_can_reject!: "0" | "1";

  @IsString()
  pg_user_phone?: string;

  @IsString()
  pg_user_contact_email?: string;

  @IsString()
  pg_testing_mode!: "0" | "1";

  @IsString()
  pg_captured!: "0" | "1";

  @IsString()
  @IsOptional()
  pg_card_id!: number;

  @IsString()
  pg_card_pan!: string;

  @IsString()
  @IsNotEmpty()
  pg_salt!: string;

  @IsString()
  @IsNotEmpty()
  pg_sig!: string;

  @IsString()
  pg_payment_method!: PaymentMethodType;

  @IsString()
  pg_card_exp!: string;

  @IsString()
  pg_card_owner!: string;

  @IsString()
  pg_card_brand!: string;
}
