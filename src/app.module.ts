import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GlobalModule } from './global/global.module';
import { HomepageModule } from './hompage/homepage.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [ConfigModule.forRoot(), GlobalModule, HomepageModule, HealthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
