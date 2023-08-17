import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ClassSerializerInterceptor, ValidationPipe } from "@nestjs/common";
import * as process from 'process';
import * as compression from 'compression';
import { BizExceptionFilter } from '@/common/http/biz-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { snapshot: true, cors: true });
  // 注册为全局middleware
  app.use(compression());
  // 注册为全局filter
  app.useGlobalFilters(new BizExceptionFilter());
  // 校验接口请求参数
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 过滤请求参数无用字段
      forbidNonWhitelisted: true, // 过滤请求参数无用字段
      transform: true, // 将request body自动转换，在对非string类型转换为指定类型很有用。ex: string -> number
      disableErrorMessages: process.env.NODE_ENV === 'production', // 生产环境下禁止返回endpoint参数详细校验信息
    }),
  );
  const configService = app.get(ConfigService);
  await app.listen(configService.get<number>('PORT'));
}

bootstrap();
