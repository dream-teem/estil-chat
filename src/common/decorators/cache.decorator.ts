import { applyDecorators, CacheInterceptor, CacheKey, CacheTTL, UseInterceptors } from '@nestjs/common';

interface CacheDecoratorArgs {
  key?: string;
  ttl?: number;
}
export const UseCache = ({ key, ttl = 0 }: CacheDecoratorArgs = {}): ReturnType<typeof applyDecorators> => (
  applyDecorators(UseInterceptors(CacheInterceptor), CacheTTL(ttl), key ? CacheKey(key) : () => {})
);
