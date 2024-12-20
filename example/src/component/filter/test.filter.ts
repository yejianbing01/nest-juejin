import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(BadRequestException)
export class TestFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const response: Response = host.switchToHttp().getResponse();

    const statusCode = exception.getStatus();
    const res = exception.getResponse() as { message: string[] };

    response.status(statusCode).json({
      code: statusCode,
      message: res.message?.join ? res.message.join(',') : exception.message,
    });
  }
}
