import { Type } from 'class-transformer';
import {
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested
} from 'class-validator';
import { WordDto } from '.';

export class AddUserExampleDto {
  @IsString()
  meaningId: string;

  @IsObject()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => WordDto)
  example: WordDto;
}
