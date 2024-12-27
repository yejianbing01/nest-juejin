import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LogMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('before', req.url);
    next();
    // console.log('after', res);
  }
}
