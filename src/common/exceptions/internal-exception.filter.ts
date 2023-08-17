import { ArgumentsHost, Catch, ExceptionFilter, InternalServerErrorException } from '@nestjs/common';
import { BizResponse } from '@/common/http/biz-response';
import { Response } from 'express';

@Catch(InternalServerErrorException)
export class InternalExceptionFilter implements ExceptionFilter {
  catch(exception: InternalServerErrorException, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const tips = exception.getResponse() as { message: string; error: string; statusCode: number };

    response.status(500).json(BizResponse.fail(tips.statusCode, tips.message));
  }
}
