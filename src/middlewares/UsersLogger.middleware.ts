import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const logStart = process.hrtime();

    res.on('finish', () => {
      const diff = process.hrtime(logStart);
      const timeInMs = diff[0] * 1e9 + diff[1] / 1e9;
      const now = new Date();
      const rightNow = now.toLocaleString();
      const rightNowToString = rightNow.toString();
      console.log(
        `'${req.method}' method was used on route ${req.originalUrl} at ${rightNowToString}. Response time: ${timeInMs.toFixed(3)}ms`,
      );
    });

    next();
  }
}
