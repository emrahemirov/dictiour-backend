import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Res,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { Roles } from 'shared/decorators/roles.decorator';
import { EvaluateReportDto, SearchParamsDto } from 'shared/dtos';
import { UserRoles } from 'shared/enums';
import { RoleGuard } from 'shared/guards/role.guard';
import { ReportService } from './report.service';

@Controller('reports')
@UseGuards(AuthGuard())
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post()
  addReport(@Body() body: { globalWordId: string }) {
    return this.reportService.addReport(body);
  }

  @Get()
  @UseGuards(RoleGuard)
  @Roles(UserRoles.ADMIN)
  getAllReports(@Query() query: SearchParamsDto) {
    return this.reportService.getAllReports(query);
  }

  @Post('/:id/evaluate')
  @UseGuards(RoleGuard)
  @Roles(UserRoles.ADMIN)
  async evaluateReport(
    @Param() { id }: { id: string },
    @Body() { isApproved }: EvaluateReportDto,
    @Res() res: Response
  ) {
    isApproved
      ? await this.reportService.approveReport(id)
      : await this.reportService.rejectReport(id);

    return res.status(HttpStatus.OK).send();
  }
}
