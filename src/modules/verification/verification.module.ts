import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';

import { ConfigService } from '@/common';

import { SmsService } from './sms.service';
import { VerificationEntity } from './verification.entity';
import { VerificationService } from './verification.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([VerificationEntity]),
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        baseURL: config.get('mobizon.url'),
        params: { output: 'json', api: 'v1', apiKey: config.get('mobizon.key') },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [VerificationService, SmsService],
  exports: [VerificationService],
})
export class VerificationModule {}
