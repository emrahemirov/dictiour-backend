import { Type } from 'class-transformer';
import { IsNotEmptyObject, IsObject, ValidateNested } from 'class-validator';
import { WordDto } from '.';

export class AddUserExampleDto {
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

  @IsObject()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => WordDto)
  example: WordDto;
}
