import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '../../global/http.service';

@Injectable()
export class VisitService {
  private readonly adminServerUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.adminServerUrl = this.configService.get<string>(
      'ADMIN_SERVER',
      'http://localhost:10002',
    );
  }

  async recordVisit(ip: string): Promise<void> {
    await this.httpService.request({
      url: `${this.adminServerUrl}/v1/admin/visit`,
      method: 'post',
      data: { ip },
    });
  }

  async getTodayVisitorCount(): Promise<number> {
    const response = await this.httpService.request<number>({
      url: `${this.adminServerUrl}/v1/admin/visit/count`,
      method: 'get',
    });
    return response.data;
  }
}
