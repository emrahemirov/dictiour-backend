import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';
import { Languages } from 'shared/enums';
import { SearchParamsDto } from './search-params.dto';

export class DictionarySearchParams extends SearchParamsDto {
  @IsOptional()
  search?: string;

  @IsOptional()
  language?: Languages;

  @IsOptional()
  userWordId?: string;

  @IsOptional()
  userMeaningId?: string;
}
