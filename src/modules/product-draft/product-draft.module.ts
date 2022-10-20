import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ProductDraft, ProductDraftSchema } from './product-draft.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: ProductDraft.name, schema: ProductDraftSchema }])],
  controllers: [],
  providers: [],
})
export class ProductDraftModule {}
