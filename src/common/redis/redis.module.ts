import { DynamicModule, Inject, Module, OnModuleDestroy, Provider } from '@nestjs/common';
import { REDIS_CLIENT, REDIS_CLIENT_OPTIONS } from '@/common/redis/redis.constants';
import {
  RedisClient,
  RedisModuleAsyncOptions,
  RedisModuleOptions,
  RedisOptionsFactory,
} from '@/common/redis/redis.interface';
import { createRedisClientProvider } from '@/common/redis/redis.provider';
import { ModuleRef } from '@nestjs/core';

@Module({})
export class RedisModule implements OnModuleDestroy {
  constructor(
    @Inject(REDIS_CLIENT_OPTIONS)
    private readonly options: RedisModuleOptions,
    private moduleRef: ModuleRef,
  ) {}

  static register(options: RedisModuleOptions): DynamicModule {
    return {
      module: RedisModule,
      global: options.global,
      providers: [
        createRedisClientProvider(),
        {
          provide: REDIS_CLIENT_OPTIONS,
          useValue: options,
        },
      ],
      exports: [REDIS_CLIENT],
    };
  }

  static registerAsync(options: RedisModuleAsyncOptions): DynamicModule {
    return {
      module: RedisModule,
      global: options.global,
      imports: options.imports || [],
      providers: [createRedisClientProvider(), ...this.createAsyncProviders(options)],
      exports: [REDIS_CLIENT],
    };
  }

  private static createAsyncProviders(options: RedisModuleAsyncOptions): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    return [this.createAsyncOptionsProvider(options), { provide: options.useClass, useClass: options.useClass }];
  }

  private static createAsyncOptionsProvider(options: RedisModuleAsyncOptions): Provider {
    if (options.useFactory) {
      return {
        provide: REDIS_CLIENT_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    return {
      provide: REDIS_CLIENT_OPTIONS,
      useFactory: async (optionsFactory: RedisOptionsFactory) => await optionsFactory.createRedisOptions(),
      inject: [options.useExisting || options.useClass],
    };
  }

  onModuleDestroy() {
    const client = this.moduleRef.get<RedisClient>(REDIS_CLIENT);
    client && client.disconnect();
  }
}
