import { Injectable } from '@nestjs/common';
import { CountryCode, parsePhoneNumber } from 'libphonenumber-js';

import type { ParsedPhoneNumber } from '../interfaces/phone';

@Injectable()
export class UtilService {
  public parsePhoneNumber(phone: string, countryCode: string): ParsedPhoneNumber {
    const phoneNumber = parsePhoneNumber(phone, <CountryCode>countryCode);

    return {
      countryCode,
      national: phoneNumber.nationalNumber,
      international: phoneNumber.number,
    };
  }

  public normalizeNumber(value: string | number): number {
    let number;
    if (typeof value === 'string') {
      number = parseFloat(value);
    } else {
      number = value;
    }

    return Math.round(number * 100) / 100;
  }
}
