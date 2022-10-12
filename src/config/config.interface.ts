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
};

export enum AppEnv {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
  TEST = 'test',
}

export type AppEnvVars = {
  NODE_ENV: AppEnv;
  PORT: number | string;
  DB_HOST: string;
  DB_PORT: number | string;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  MONGO_DB_URL: string;
  MONGO_DB_NAME?: string;
  REDIS_URL: string;
  JWT_SECRET: string;
  JWT_REFRESH_SECRET: string;
};
