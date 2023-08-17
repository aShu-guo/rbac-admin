import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import { BizResponse } from '@/common/http/biz-response';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const tips = exception.getResponse() as { message: string; error: string; statusCode: number };
    // 区分http error和业务错误
    response.status(exception.getStatus()).json(BizResponse.fail(tips.statusCode, tips.message));
  }
}
