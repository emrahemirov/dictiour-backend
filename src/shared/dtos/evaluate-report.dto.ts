import { IsBoolean } from 'class-validator';

export class EvaluateReportDto {
  @IsBoolean()
  isApproved: boolean;
}
