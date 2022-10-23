import type {
  CacheStoreFactory,
  MiddlewareConsumer,
  NestModule } from '@nestjs/common';
import {
  BadRequestException,
  CacheModule,
  Module,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_PIPE, RouterModule } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SentryModule } from '@ntegral/nestjs-sentry';
import * as redisStore from 'cache-manager-redis-store';
import type { ValidationError } from 'class-validator';
import type { RedisClientOptions } from 'redis';

import { CommonModule, LoggerMiddleware } from './common';
import { configuration, validateEnv } from './config';
import { AuthModule } from './modules';
import { ChatModule } from './modules/chat/chat.module';
import { CityModule } from './modules/cities/city.module';
import { FollowingModule } from './modules/following/following.module';
import { ProductDraftModule } from './modules/product-draft/product-draft.module';
import { ProductLikeModule } from './modules/product-like/product-like.module';
import { ProductRatingModule } from './modules/product-rating/product-rating.module';
import { ProductModule } from './modules/product/product.module';
import { VerificationModule } from './modules/verification/verification.module';

@Module({
  imports: [
    // Configuration
    // https://docs.nestjs.com/techniques/configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validate: validateEnv,
    }),
    SentryModule.forRoot({
      dsn: process.env.SENTRY_DSN,
      debug: false,
      environment: process.env.NODE_ENV,
      logLevels: ['debug'], // based on sentry.io loglevel //
    }),
    ThrottlerModule.forRoot({
      ttl: parseInt(process.env.THROTTLE_TTL, 10),
      limit: parseInt(process.env.THROTTLE_LIMIT, 10),
    }),
    // Database
    // https://docs.nestjs.com/techniques/database
    TypeOrmModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        ...(await config.get('db')),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        ...{ uri: await config.get('mongodb.url'), autoIndex: false },
      }),
      inject: [ConfigService],
    }),
    CacheModule.registerAsync<RedisClientOptions>({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        store: <CacheStoreFactory>redisStore,
        url: await config.get('redis.url'),
      }),
      inject: [ConfigService],
    }),
    // Service Modules
    CommonModule, // Global
    AuthModule,
    VerificationModule,
    ChatModule,
    ProductModule,
    ProductDraftModule,
    ProductLikeModule,
    FollowingModule,
    ProductRatingModule,
    CityModule,
    // Module Router
    // https://docs.nestjs.com/recipes/router-module
    RouterModule.register([]),
  ],
  providers: [
    // Global Guard, Authentication check on all routers
    // { provide: APP_GUARD, useClass: AuthenticatedGuard },
    // Global Filter, Exception check
    // { provide: APP_FILTER, useClass: ExceptionsFilter },
    // Global Pipe, Validation check
    // https://docs.nestjs.com/pipes#global-scoped-pipes
    // https://docs.nestjs.com/techniques/validation
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        // disableErrorMessages: true,
        transform: true, // transform object to DTO class
        whitelist: true,
        exceptionFactory: (errors: ValidationError[]): BadRequestException => new BadRequestException(errors),
      }),
    },
  ],
})
export class AppModule implements NestModule {
  // Global Middleware, Inbound logging
  public configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
