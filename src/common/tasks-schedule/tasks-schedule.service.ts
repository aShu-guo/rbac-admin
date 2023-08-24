import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRedisClient, RedisClient } from '@ashu_guo/nest-redis';
import { JwtPayloadDto } from '@/modules/auth/dtos/jwt-payload.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RedisKeyEnum } from '@/common/redis/redis.constants';

@Injectable()
export class TasksScheduleService {
  constructor(
    @InjectRedisClient() private readonly redisClient: RedisClient,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  @Cron(CronExpression.EVERY_DAY_AT_11PM)
  openForBusiness() {
    console.log('Delicious cakes is open for business...');

    // new CronJ
  }

  @Cron(CronExpression.EVERY_DAY_AT_11PM)
  async cleanBlackListToken() {
    const tasks: Promise<JwtPayloadDto>[] = [];
    const refreshTokenList = await this.redisClient.smembers(RedisKeyEnum.AuthRefreshToken);
    refreshTokenList.forEach((refreshToken) =>
      tasks.push(
        this.jwtService.verifyAsync<JwtPayloadDto>(refreshToken, {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        }),
      ),
    );

    const verifyTokenList = await Promise.allSettled(tasks);

    this.redisClient.srem(
      RedisKeyEnum.AuthRefreshToken,
      refreshTokenList
        .map((refreshToken, index) => {
          if (verifyTokenList[index].status === 'rejected') {
            return refreshToken;
          }
        })
        .filter((refreshToken) => !!refreshToken),
    );
  }
}
