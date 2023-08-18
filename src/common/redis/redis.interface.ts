import Redis, { RedisOptions } from 'ioredis';
import { ModuleMetadata, Type } from '@nestjs/common';

export type RedisClient = Redis;

export interface RedisOptionsFactory {
  createRedisOptions(): Promise<RedisOptions> | RedisOptions;
}

export interface RedisModuleOptions extends RedisOptions {
  global?: boolean;
}

export interface RedisModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  global?: boolean;
  useExisting?: Type<RedisOptionsFactory>;
  useClass?: Type<RedisOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<RedisModuleOptions> | RedisModuleOptions;
  inject?: any[];
}
