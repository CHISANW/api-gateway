import { Controller, Get, Post, Req } from '@nestjs/common';
import type { Request } from 'express';
import { getClientIp } from '../../common/network/client-ip.util';
import { VisitService } from './visit.service';

@Controller('api/admin/visit')
export class VisitController {
  constructor(private readonly visitService: VisitService) {}

  @Post()
  async recordVisit(@Req() request: Request): Promise<void> {
    console.log('여기에 접근은 하니거니 .. ? ');
    const ip = getClientIp(request);
    await this.visitService.recordVisit(ip);
  }

  @Get('count')
  async getTodayVisitorCount() {
    return await this.visitService.getTodayVisitorCount();
  }
}
