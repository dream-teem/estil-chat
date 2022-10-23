import { IsPhoneNumber } from '@/common/validators/is-phone-number.validator';
import { IsString, IsNotEmpty } from 'class-validator';

export class SendVerificationRequestDto {
  @IsString()
  @IsNotEmpty()
  countryCode!: string;

  @IsPhoneNumber('countryCode')
  @IsNotEmpty()
  phone!: string;
}
