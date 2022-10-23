import { BaseSchema } from '@/common/base.schema';
import { SchemaName } from '@/common/enums/schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { Document } from 'mongoose';
import mongoose from 'mongoose';
import type { City } from '../cities/city.interface';
import type { ProductBrand } from '../product/interfaces/product-brand.interface';
import type { ProductCategory } from '../product/interfaces/product-category.interface';
import type { Color } from '../product/interfaces/product-color.interface';
import type { ProductCondition } from '../product/interfaces/product-condition.interface';
import type { ProductCurrency, ProductImage } from '../product/interfaces/product.interface';

export type ProductDraftDocument = ProductDraft & Document<mongoose.Schema.Types.ObjectId>;

@Schema({
  timestamps: true,
  collection: SchemaName.PRODUCT_DRAFT,
})
export class ProductDraft extends BaseSchema {
  @Prop({ required: true, type: Number, index: true })
  userId!: number;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  category?: ProductCategory;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  brand?: ProductBrand;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  condition?: ProductCondition;

  @Prop({ type: [mongoose.Schema.Types.Mixed] })
  colors?: Color[];

  @Prop({ type: [mongoose.Schema.Types.Mixed] })
  images?: ProductImage[];

  @Prop({ type: mongoose.Schema.Types.Mixed })
  city?: City;

  @Prop()
  description?: string;

  @Prop()
  price?: number;

  @Prop()
  quantity?: number;

  @Prop()
  currency?: ProductCurrency;
}

export const ProductDraftSchema = SchemaFactory.createForClass(ProductDraft);
