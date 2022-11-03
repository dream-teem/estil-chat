import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';

import { ConfigService } from '@/common';

import { ProductModule } from '../product/product.module';
import { PayboxController } from './controllers/paybox.controller';
import { PurchaseController } from './controllers/purchase.controller';
import { PayboxChargeEntity } from './entities/paybox-charge.entity';
import { PayboxEventEntity } from './entities/paybox-event.entity';
import { PaymentMethodEntity } from './entities/payment-method.entity';
import { PurchaseEntity } from './entities/purchase.entity';
import { PayboxChargeService } from './services/paybox-charge.service';
import { PayboxWebhookHandlerService } from './services/paybox-webhook-handler.service';
import { PayboxService } from './services/paybox.service';
import { PaymentMethodService } from './services/payment-method.service';
import { PurchaseService } from './services/purchase.service';
import { parseXmlData } from './utils/paybox';

@Module({
  imports: [
    ProductModule,
    TypeOrmModule.forFeature([PurchaseEntity, PayboxChargeEntity, PaymentMethodEntity, PayboxEventEntity]),
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        baseURL: config.get('paybox.url'),
        transformResponse: parseXmlData,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [PurchaseController, PayboxController],
  providers: [PurchaseService, PayboxService, PayboxChargeService, PayboxWebhookHandlerService, PaymentMethodService],
  exports: [],
})
export class PurchaseModule {}
