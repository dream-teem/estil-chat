import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { SentryService } from '@ntegral/nestjs-sentry';
import type { AxiosResponse } from 'axios';
import FormData from 'form-data';

import { ConfigService } from '@/common/providers/config.service';

import {
  PayboxInitPaymentParams,
  PayboxScriptName,
  PayboxRequestCommonParams,
  PayboxParams,
  PayboxInitPaymentResponse,
  PayboxRevokePaymentParams,
  PayboxRevokePaymentResponse,
} from '../interfaces/paybox.interface';
import { makeParamsWithSignature } from '../utils/paybox';

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
    const formData = await this.prepareData(
      PayboxScriptName.INIT_PAYMENT,
      {
        ...data,
        pg_description: this.PAYBOX_PAYMENT_DESCRIPTION,
      },
      this.PAYBOX_PAYMENT_SECRET,
    );

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

  public async revokePayment(data: PayboxRevokePaymentParams): Promise<PayboxRevokePaymentResponse> {
    const formData = await this.prepareData(PayboxScriptName.REVOKE, data, this.PAYBOX_PAYMENT_SECRET);

    return this.httpService.axiosRef
      .post<PayboxRevokePaymentResponse>('/revoke.php', formData, {
      headers: formData.getHeaders(),
    })
      .catch((err: unknown) => {
        this.sentry.instance().captureException(`Error revoking payment ${data.pg_payment_id}: ${err}`);
        throw err;
      })
      .then((res: AxiosResponse<PayboxRevokePaymentResponse>) => res.data);
  }

  public async prepareData(scriptName: string, data: Record<string, any>, secret: string): Promise<FormData> {
    const formData = new FormData();

    const defaultParams = this.getDefaultParams();

    const params: PayboxParams = { ...defaultParams, ...data };

    const paramsWithSig = await makeParamsWithSignature(scriptName, params, secret);

    Object.entries(paramsWithSig).forEach(([key, value]: [string, string | number]) => {
      formData.append(key, value);
    });

    return formData;
  }

  private getDefaultParams(): PayboxRequestCommonParams {
    return {
      pg_merchant_id: this.PAYBOX_PROJECT_ID,
    };
  }
}
