import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';
import { Languages } from 'shared/enums';

export class SearchParamsDto {
  @IsOptional()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page? = 1;

  @IsOptional()
  language?: Languages;

  @IsOptional()
  userWordId?: string;

  @IsOptional()
  userMeaningId?: string;
}
