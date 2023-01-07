import { Type } from 'class-transformer';
import {
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested
} from 'class-validator';
import { WordDto } from '.';

export class AddUserMeaningDto {
  @IsOptional()
  @IsString()
  fromWordId?: string;

  @IsOptional()
  @IsObject()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => WordDto)
  fromWord?: WordDto;

  @IsObject()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => WordDto)
  toWord: WordDto;
}
