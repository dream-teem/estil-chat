import { Injectable } from '@nestjs/common';

import { ThumbnailService } from '@/common/providers/thumbnail.service';

import { PRODUCT_IMAGE_THUMBNAILS } from '../constants/product.constant';
import type { ProductImage, ProductThumbnailAll } from '../interfaces/product.interface';

@Injectable()
export class ProductImageService {
  private S3_PRODUCT_IMAGE_DIR: string = 'products';
  constructor(private readonly thumbnail: ThumbnailService) {}

  public async uploadProductImage(userId: number, image: Buffer): Promise<ProductImage> {
    const dir = `${this.S3_PRODUCT_IMAGE_DIR}/${userId}`;
    return this.thumbnail.saveImageThumbnails<ProductThumbnailAll>(image, {
      dir,
      thumbnailSizes: PRODUCT_IMAGE_THUMBNAILS,
    });
  }
}
