import type { AppConfig } from '../config.interface';

export const config: AppConfig = {
  db: {
    type: 'postgres',
    entities: [`${__dirname}/../../modules/**/*.entity.{js,ts}`],
    synchronize: false,
    subscribers: [`${__dirname}/../../db/subscriber/**/*.{js,ts}`],
    migrations: [`${__dirname}/../../db/migration/**/*.{js,ts}`],
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET,
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
    jwtExpiration: '15m',
    jwtRefreshExpiration: '7 days',
    cookieSecure: false,
  },
  server: {
    port: 3000,
    cors: false,
  },
  redis: {
    url: process.env.REDIS_URL,
  },
  mongodb: {
    url: process.env.MONGO_DB_URL,
  },
  mobizon: {
    url: process.env.MOBIZON_API_URL,
    key: process.env.MOBIZON_API_KEY,
    disabled: JSON.parse(process.env.MOBIZON_DISABLED),
  },
  paybox: {
    url: process.env.PAYBOX_URL,
    projectId: process.env.PAYBOX_PROJECT_ID,
    paymentSecret: process.env.PAYBOX_PAYMENT_SECRET,
    payoutSecret: process.env.PAYBOX_PAYOUT_SECRET,
  },
  s3: {
    accessKey: process.env.AWS_S3_ACCESS_KEY,
    secretKey: process.env.AWS_S3_SECRET_KEY,
    bucketName: process.env.AWS_S3_BUCKET_NAME,
  },
};
