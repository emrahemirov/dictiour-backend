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
  @IsString()
  fromWordId: string;

  @IsObject()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => WordDto)
  toWord: WordDto;
}
