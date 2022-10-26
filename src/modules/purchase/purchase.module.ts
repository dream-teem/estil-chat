import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';

import { PurchaseController } from './controllers/purchase.controller';
import { PurchaseEntity } from './entities/purchase.entity';
import { PurchaseService } from './purchase.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PurchaseEntity,
    ]),
  ],
  controllers: [PurchaseController],
  providers: [PurchaseService],
  exports: [],
})
export class PurchaseModule {}
