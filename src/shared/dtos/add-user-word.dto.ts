import { Type } from 'class-transformer';
import { IsNotEmptyObject, IsObject, ValidateNested } from 'class-validator';
import { WordDto } from '.';

export class AddUserWordDto {
  @IsObject()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => WordDto)
  word: WordDto;
}
