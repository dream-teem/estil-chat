import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SentryService } from '@ntegral/nestjs-sentry';
import moment from 'moment';
import { Repository } from 'typeorm';
import type { EntityManager } from 'typeorm';

import { ConfigService } from '@/common';
import type { ParsedPhoneNumber } from '@/common/interfaces/phone';

import type { ConfirmVerificationRequestDto } from '../auth/dto/confirm-verification.request.dto';
import type { ConfirmVerificationResponseDto } from '../auth/dto/confirm-verification.response.dto';
import { SmsService } from './sms.service';
import { VerificationEntity } from './verification.entity';
import type { SendVerificationRO, Verification } from './verification.interface';

@Injectable()
export class VerificationService {
  private SMS_EXPIRATION_DURATION: number = 10 * 60; // in seconds

  private SMS_TEXT_PREFIX: string = 'Код подтверждения для Estil.kz:';

  private MOBIZON_DISABLED: boolean;

  constructor(
    @InjectRepository(VerificationEntity) private verificationRepository: Repository<VerificationEntity>,
    private readonly sms: SmsService,
    config: ConfigService,
    private readonly sentry: SentryService,
  ) {
    this.MOBIZON_DISABLED = config.get('mobizon.disabled');
  }

  public async getVerificationById(id: string): Promise<Verification | null> {
    return this.verificationRepository.findOne({ where: { id } });
  }

  public async confirmVerification({ smsCode, verificationId }: ConfirmVerificationRequestDto): Promise<ConfirmVerificationResponseDto> {
    const verification = await this.verificationRepository.findOne({
      where: {
        smsCode,
        id: verificationId,
        isVerified: false,
      },
    });

    const isInvalid = !verification || moment().isAfter(moment(verification.expiration));

    if (isInvalid) {
      throw new BadRequestException('Невалидный код или уже был использован');
    }

    const { affected } = await this.verificationRepository.update({ smsCode, id: verificationId, isVerified: false }, { isVerified: true });

    if (affected === 0) {
      throw new BadRequestException('Код уже был использован');
    }

    return { isVerified: true };
  }

  public async sendVerification(phone: ParsedPhoneNumber): Promise<SendVerificationRO> {
    return this.verificationRepository.manager.transaction(async (entityManager: EntityManager) => {
      const verification = entityManager.create(VerificationEntity, {
        phone: phone.national,
        countryCode: phone.countryCode,
        expiration: moment().add(this.SMS_EXPIRATION_DURATION, 'seconds'),
        smsCode: this.generateCode(),
      });

      await entityManager.save(verification);

      if (this.MOBIZON_DISABLED) {
        this.sentry.debug(`Verification code sent to ${phone.international}: ${verification.smsCode}`);
      } else {
        await this.sms.sendMessage({
          recipient: phone.international.replace('+', ''),
          text: `${this.SMS_TEXT_PREFIX} ${verification.smsCode}`,
          name: 'Estil.kz',
        });
      }

      return {
        verificationId: verification.id,
        isVerified: verification.isVerified,
      };
    });
  }

  private generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
