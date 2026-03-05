import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { HomepageModule } from './domain/hompage/homepage.module';
import { HealthModule } from './domain/health/health.module';
import { VisitModule } from './domain/visit/visit.module';
import { GlobalModule } from './global/global.module';
import { IpRateLimitGuard } from './common/rate-limit/ip-rate-limit.guard';
import { IpRateLimitService } from './common/rate-limit/ip-rate-limit.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GlobalModule,
    HomepageModule,
    HealthModule,
    VisitModule,
  ],
  controllers: [],
  providers: [
    IpRateLimitService,
    {
      provide: APP_GUARD,
      useClass: IpRateLimitGuard,
    },
  ],
})
export class AppModule {}
