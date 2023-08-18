import { Provider } from '@nestjs/common';
import Redis, { RedisOptions } from 'ioredis';
import { REDIS_CLIENT, REDIS_CLIENT_OPTIONS } from '@/common/redis/redis.constants';
import { RedisClient } from '@/common/redis/redis.interface';

export const createRedisClientProvider = (): Provider => ({
  provide: REDIS_CLIENT,
  inject: [REDIS_CLIENT_OPTIONS],
  useFactory: (options: RedisOptions): RedisClient => {
    return new Redis(options);
  },
});
