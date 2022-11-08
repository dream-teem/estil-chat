import { Injectable } from '@nestjs/common';
import { SentryService } from '@ntegral/nestjs-sentry';
import S3 from 'aws-sdk/clients/s3';

import { ConfigService } from './config.service';

@Injectable()
export class S3Service {
  private s3: S3;
  private bucket: string;
  constructor(config: ConfigService, private readonly sentry: SentryService) {
    this.s3 = new S3({
      credentials: {
        accessKeyId: config.get('s3.accessKey'),
        secretAccessKey: config.get('s3.secretKey'),
      },
      maxRetries: 3,
    });
    this.bucket = config.get('s3.bucketName');
  }

  public async uploadFile(key: string, file: Buffer): Promise<string> {
    const Key = key.charAt(0) === '/' ? key.substring(1) : key;

    const params = {
      Body: file,
      Bucket: this.bucket,
      Key,
    };

    await this.s3
      .putObject(params)
      .promise()
      .catch((err: unknown) => {
        this.sentry.instance().captureException(`Error uploading to S3 at path ${key}:  ${err}`);
        throw err;
      });

    return Key;
  }
}
