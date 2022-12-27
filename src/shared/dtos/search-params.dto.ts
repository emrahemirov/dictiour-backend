import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class SearchParamsDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page? = 1;
}
