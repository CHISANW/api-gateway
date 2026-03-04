import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GlobalModule } from './global/global.module';
import { HomepageModule } from './domain/hompage/homepage.module';
import { HealthModule } from './domain/health/health.module';
import { VisitModule } from './domain/visit/visit.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GlobalModule,
    HomepageModule,
    HealthModule,
    VisitModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
