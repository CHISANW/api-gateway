import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { VisitController } from './visit.controller';
import { VisitService } from './visit.service';

@Module({
  imports: [ConfigModule],
  controllers: [VisitController],
  providers: [VisitService],
  exports: [VisitService],
})
export class VisitModule {}
