import { Type } from 'class-transformer';
import { IsNotEmptyObject, IsObject, ValidateNested } from 'class-validator';
import { WordDto } from '.';

export class AddUserMeaningDto {
  @IsObject()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => WordDto)
  fromWord: WordDto;

  @IsObject()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => WordDto)
  toWord: WordDto;
}
