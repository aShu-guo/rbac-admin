import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import * as process from 'process';
import { AuthModule } from '@/modules/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthGuard } from '@/modules/auth/auth.guard';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '@/modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { RedisModule } from '@ashu_guo/nest-redis';
import { TasksScheduleModule } from './common/tasks-schedule/tasks-schedule.module';

@Module({
  imports: [
    DevtoolsModule.register({
      http: process.env.NODE_ENV !== 'production',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath:
        process.env.NODE_ENV === 'development'
          ? [
              `${process.cwd()}/env/.env.${process.env.NODE_ENV}.local`,
              `${process.cwd()}/env/.env.${process.env.NODE_ENV}`,
            ]
          : [`${process.cwd()}/env/.env.${process.env.NODE_ENV}`],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
        PORT: Joi.number().default(3000),
      }),
      expandVariables: true,
      validationOptions: {
        abortEarly: true,
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [
        ConfigModule.forRoot({
          validationSchema: Joi.object({
            MYSQL_USERNAME: Joi.string().required(),
            MYSQL_PASSWORD: Joi.string().required(),
            MYSQL_DATABASE: Joi.string().default('rbac-admin'),
            MYSQL_HOST: Joi.string().default('localhost'),
            MYSQL_PORT: Joi.number().default(3306),
          }),
        }),
      ],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('MYSQL_HOST'),
        port: configService.get<number>('MYSQL_PORT'),
        username: configService.get<string>('MYSQL_USERNAME'),
        password: configService.get<string>('MYSQL_PASSWORD'),
        database: configService.get<string>('MYSQL_DATABASE'),
        logging: true,
        autoLoadEntities: true, // true - 无需再手动添加entity到entities数组中，会自动收集标注了@entity()到entities数组中
        synchronize: false,
      }),
    }),
    JwtModule.registerAsync({
      global: true,
      imports: [
        ConfigModule.forRoot({
          validationSchema: Joi.object({
            JWT_SECRET: Joi.string().required(),
            JWT_REFRESH_SECRET: Joi.string().required(),
            JWT_EXPIRES_IN: Joi.string().default('10m'),
            JWT_REFRESH_EXPIRES_IN: Joi.string().default('7d'),
          }),
        }),
      ],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN'),
        },
      }),
    }),
    RedisModule.registerAsync({
      global: true,
      imports: [
        ConfigModule.forRoot({
          validationSchema: Joi.object({
            REDIS_HOST: Joi.string().default('localhost'),
            REDIS_PORT: Joi.number().default(6379),
            REDIS_USERNAME: Joi.string().default('default'),
            REDIS_PASSWORD: Joi.string().required(),
          }),
        }),
      ],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        host: configService.get<string>('REDIS_HOST'),
        port: configService.get<number>('REDIS_PORT'),
        username: configService.get<string>('REDIS_USERNAME'),
        password: configService.get<string>('REDIS_PASSWORD'),
      }),
    }),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 30,
    }),
    AuthModule,
    UsersModule,
    RolesModule,
    TasksScheduleModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor },
  ],
})
export class AppModule {}
