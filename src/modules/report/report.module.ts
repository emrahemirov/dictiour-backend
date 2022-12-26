import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GlobalWord, Report } from 'entities';
import { AuthModule } from 'modules/auth/auth.module';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Report, GlobalWord])],
  providers: [ReportService],
  controllers: [ReportController]
})
export class ReportModule {}
