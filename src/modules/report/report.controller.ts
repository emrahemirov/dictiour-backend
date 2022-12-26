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
@UseGuards(AuthGuard, RoleGuard)
@Roles(UserRoles.ADMIN, UserRoles.EDITOR)
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get()
  getAllReports(@Query() query: SearchParamsDto) {
    return this.reportService.getAllReports(query);
  }

  @Post(':id/evaluate')
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
