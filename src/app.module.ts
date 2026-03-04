import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GlobalModule } from './global/global.module';
import { HomepageModule } from './hompage/homepage.module';

@Module({
  imports: [ConfigModule.forRoot(), GlobalModule, HomepageModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
