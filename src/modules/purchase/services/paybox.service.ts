import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { SentryService } from '@ntegral/nestjs-sentry';
import type { AxiosResponse } from 'axios';
import bcrypt from 'bcrypt';
import FormData from 'form-data';

import { ConfigService } from '@/common/providers/config.service';

import {
  PayboxInitPaymentParams,
  PayboxScriptName,
  PayboxRequestCommonParams,
  PayboxParams,
  PayboxInitPaymentResponse,
} from '../interfaces/paybox.interface';
import { makePayboxSignature } from '../utils/paybox';

@Injectable()
export class PayboxService {
  private PAYBOX_PROJECT_ID: string;
  private PAYBOX_PAYMENT_SECRET: string;
  // private PAYBOX_PAYOUT_SECRET: string;

  private PAYBOX_PAYMENT_DESCRIPTION: string = 'Покупка в интернет магазине Estil.kz';

  constructor(private readonly httpService: HttpService, private readonly sentry: SentryService, config: ConfigService) {
    this.PAYBOX_PROJECT_ID = config.get('paybox.projectId');
    this.PAYBOX_PAYMENT_SECRET = config.get('paybox.paymentSecret');
    // this.PAYBOX_PAYOUT_SECRET = config.get('paybox.payoutSecret');
  }

  public async initPayment(data: PayboxInitPaymentParams): Promise<PayboxInitPaymentResponse> {
    const formData = await this.prepareData(PayboxScriptName.INIT_PAYMENT, data, this.PAYBOX_PAYMENT_SECRET);

    return this.httpService.axiosRef
      .post<PayboxInitPaymentResponse>('/init_payment.php', formData, {
      headers: formData.getHeaders(),
    })
      .catch((err: unknown) => {
        this.sentry.instance().captureException(`Error initiating payment ${data.pg_order_id}: ${err}`);
        throw err;
      })
      .then((res: AxiosResponse<PayboxInitPaymentResponse>) => res.data);
  }

  public async prepareData(scriptName: string, data: Omit<PayboxParams, 'pg_sig'>, secret: string): Promise<FormData> {
    const formData = new FormData();

    const defaultParams = await this.getDefaultParams();

    const params: PayboxParams = { ...defaultParams, ...data };

    params.pg_sig = makePayboxSignature(scriptName, params, secret);

    Object.entries(params).forEach(([key, value]: [string, string | number]) => {
      formData.append(key, value);
    });

    return formData;
  }

  private async getDefaultParams(): Promise<PayboxRequestCommonParams> {
    return {
      pg_description: this.PAYBOX_PAYMENT_DESCRIPTION,
      pg_salt: await this.generateRandomSalt(),
      pg_merchant_id: this.PAYBOX_PROJECT_ID,
    };
  }

  private async generateRandomSalt(): Promise<string> {
    return bcrypt.genSalt();
  }
}
