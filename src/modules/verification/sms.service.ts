import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { SentryService } from '@ntegral/nestjs-sentry';

@Injectable()
export class SmsService {
  constructor(private readonly httpService: HttpService, private readonly sentry: SentryService) {
  }

  public async sendMessage(data: Record<'recipient' | 'text' | 'name', string>): Promise<unknown> {
    return this.httpService.axiosRef
      .post('/service/Message/SendSmsMessage', data, {
        withCredentials: true,
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          'cache-control': 'no-cache',
        },
      })
      .catch((err: unknown) => {
        this.sentry.instance().captureException(`Error sending sms to receipient ${data.recipient}: ${err}`);
        throw err;
      });
  }
}
