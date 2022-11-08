import { Injectable } from '@nestjs/common';
import { zipObject } from 'lodash';
import sharp from 'sharp';
import { v4 as uuid } from 'uuid';

import type { ImageWithThumbnails, SaveImageThumbnailsOptions } from '../interfaces/thumbnail';
import { S3Service } from './s3.service';

@Injectable()
export class ThumbnailService {
  constructor(private readonly s3: S3Service) {}
  public async generateThumbnails(data: Buffer, thumbnails: readonly number[]): Promise<Buffer[]> {
    return thumbnails.reduce(async (prevPromise: Promise<Buffer[]>, thumbnail: number) => {
      const allThumbnails = await prevPromise;

      const thumbnailBuffer = await this.resizeImage(data, thumbnail);

      return allThumbnails.concat(thumbnailBuffer);
    }, Promise.resolve([]));
  }

  public async resizeImage(data: Buffer, thumbnail: number): Promise<Buffer> {
    // https://stackoverflow.com/questions/48716266/sharp-image-library-rotates-image-when-resizing
    return sharp(data).resize({ height: thumbnail, width: thumbnail }).withMetadata().toBuffer();
  }

  public async saveImageThumbnails<T extends readonly number[]>(
    image: Buffer,
    { dir, format = 'jpeg', thumbnailSizes }: SaveImageThumbnailsOptions<T>,
  ): Promise<ImageWithThumbnails<T>> {
    const thumbnailFiles = await this.generateThumbnails(image, thumbnailSizes);

    const filesToUpload = [image, ...thumbnailFiles];

    const [originalFileKey, ...thumbnailKeys] = await filesToUpload.reduce(async (prevPromise: Promise<string[]>, file: Buffer) => {
      const fileUrls = await prevPromise;
      const fileKey = this.getImageS3Key(dir, format);
      const url = await this.s3.uploadFile(fileKey, file);

      return fileUrls.concat(url);
    }, Promise.resolve([]));

    const thumbnails = <Record<T[number], string>>zipObject(thumbnailSizes, thumbnailKeys);

    return {
      original: originalFileKey,
      thumbnails,
    };
  }

  public getImageS3Key(dir: string, format: string): string {
    return `${dir}/${uuid()}.${format}`;
  }
}
