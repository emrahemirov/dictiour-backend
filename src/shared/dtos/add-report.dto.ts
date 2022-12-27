import { IsNotEmpty, IsString } from 'class-validator';

export class AddReportDto {
  @IsNotEmpty()
  @IsString()
  globalWordId: string;
}
