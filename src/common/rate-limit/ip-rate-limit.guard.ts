import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { getClientIp } from '../network/client-ip.util';
import { IpRateLimitService } from './ip-rate-limit.service';

@Injectable()
export class IpRateLimitGuard implements CanActivate {
  constructor(private readonly ipRateLimitService: IpRateLimitService) {}

  canActivate(context: ExecutionContext): boolean {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<Request>();
    const response = httpContext.getResponse<Response>();
    const ip = getClientIp(request);

    const result = this.ipRateLimitService.consume(ip);

    response.setHeader('X-RateLimit-Limit', result.limit.toString());
    response.setHeader('X-RateLimit-Remaining', result.remaining.toString());
    response.setHeader('X-RateLimit-Reset', result.resetAt.toString());

    if (!result.allowed) {
      response.setHeader('Retry-After', result.retryAfterSeconds.toString());
      throw new HttpException(
        'Rate limit exceeded. Try again in 1 minute.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    return true;
  }
}
