import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly client: RedisClientType;
  constructor(private configService: ConfigService) {
    this.client = createClient({
      socket: {
        host: configService.get<string>('REDIS_HOST'),
        port: configService.get<number>('REDIS_PORT'),
      },
      password: this.configService.get<string>('REDIS_PASSWORD'),
    });
    this.client.connect();
  }

  getClient(): RedisClientType {
    return this.client;
  }

  onModuleDestroy() {
    this.client.disconnect();
  }
}
