import { Controller, Get, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { VisitService } from './visit.service';

@Controller('admin/visit')
export class VisitController {
  constructor(private readonly visitService: VisitService) {}

  @Post()
  async recordVisit(@Req() request: any): Promise<void> {
    const ip = this.getClientIp(request);
    await this.visitService.recordVisit(ip);
  }

  @Get('count')
  async getTodayVisitorCount() {
    return await this.visitService.getTodayVisitorCount();
  }

  private getClientIp(request: Request): string {
    const headers = request.headers;
    let ip = headers['x-forwarded-for'] as string;

    if (!ip || ip.toLowerCase() === 'unknown') {
      ip = headers['proxy-client-ip'] as string;
    }
    if (!ip || ip.toLowerCase() === 'unknown') {
      ip = headers['wl-proxy-client-ip'] as string;
    }
    if (!ip || ip.toLowerCase() === 'unknown') {
      ip = headers['http_client_ip'] as string;
    }
    if (!ip || ip.toLowerCase() === 'unknown') {
      ip = headers['http_x_forwarded_for'] as string;
    }
    if (!ip || ip.toLowerCase() === 'unknown') {
      if (request.socket.remoteAddress != null) {
        ip = request.socket.remoteAddress;
      }
    }

    // X-Forwarded-For는 여러 IP가 콤마로 연결될 수 있으므로 첫 번째 IP를 가져옴
    if (ip && ip.includes(',')) {
      ip = ip.split(',')[0].trim();
    }

    return ip;
  }
}
