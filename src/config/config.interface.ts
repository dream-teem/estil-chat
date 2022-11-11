import type { TypeOrmModuleOptions } from '@nestjs/typeorm/dist/interfaces';

export type Objectype = Record<string, unknown>;
export type DeepPartial<T> = T extends object ? {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? DeepPartial<U>[]
    : T[P] extends Readonly<infer U>[]
      ? Readonly<DeepPartial<U>>[]
      : DeepPartial<T[P]>
} : T;
export type AppEnvConfig = DeepPartial<AppConfig>;

export type AppConfig = {
  db: TypeOrmModuleOptions;
  server: {
    port: number;
    cors: boolean;
  };
  auth: {
    jwtSecret: string;
    jwtRefreshSecret: string;
    jwtExpiration: number | string;
    jwtRefreshExpiration: number | string;
    cookieSecure: boolean;
  };
  redis: {
    url: string;
  };
  mongodb: {
    url: string;
  };
  mobizon: {
    url: string;
    key: string;
    disabled: boolean;
  };
  paybox: {
    url: string;
    projectId: string;
    paymentSecret: string;
    payoutSecret: string;
  };
  s3: {
    accessKey: string;
    secretKey: string;
    bucketName: string;
  };
  elastic: {
    node: string;
  };
};

export enum AppEnv {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
  TEST = 'test',
}

export type AppEnvVars = {
  NODE_ENV: AppEnv;
  PORT: string;
  WS_PORT: string;
  DB_HOST: string;
  DB_PORT: number | string;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  MONGO_DB_URL: string;
  MONGO_DB_NAME?: string;
  REDIS_URL: string;
  SENTRY_DSN: string;
  JWT_SECRET: string;
  JWT_REFRESH_SECRET: string;
  THROTTLE_TTL: string;
  THROTTLE_LIMIT: string;
  MOBIZON_API_URL: string;
  MOBIZON_API_KEY: string;
  MOBIZON_DISABLED: string;
  PAYBOX_URL: string;
  PAYBOX_PROJECT_ID: string;
  PAYBOX_PAYMENT_SECRET: string;
  PAYBOX_PAYOUT_SECRET: string;
  AWS_S3_ACCESS_KEY: string;
  AWS_S3_SECRET_KEY: string;
  AWS_S3_BUCKET_NAME: string;
  ELASTIC_SEARCH_NODE: string;
  ELASTICSEARCH_PRODUCT_INDEX: string;
};
