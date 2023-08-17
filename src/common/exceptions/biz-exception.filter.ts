import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Request, Response } from 'express';
import { BizResponse } from '@/common/http/biz-response';
import { BizException } from "@/common/exceptions/biz-exception";

/**
 * 业务异常filter
 */
@Catch(BizException)
export class BizExceptionFilter implements ExceptionFilter {
  catch(exception: BizException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    // 区分http error和业务错误
    response.status(200).json(BizResponse.fail(exception.getBizCode(), exception.getErrorTips()));
  }
}
