/* eslint-disable linebreak-style */
// import { DeniedPermission } from '@constants';
import {
  Injectable,
  NestMiddleware,
  // UnauthorizedException,
} from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';

@Injectable()
export default class RequireAuthMiddleware implements NestMiddleware {
  constructor(
  ) {}

  public async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    // if (!req.token) throw new UnauthorizedException(DeniedPermission);
    next();
  }
}
