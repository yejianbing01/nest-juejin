import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { IncomingHttpHeaders } from 'http';

export const Ccc = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    return 'Ccc';
  },
);

export const MyHeaders = createParamDecorator(
  (key: string | undefined, ctx: ExecutionContext) => {
    const req: Request = ctx.switchToHttp().getRequest();
    return key ? req.headers[key.toLocaleLowerCase()] : req.headers;
  },
);
