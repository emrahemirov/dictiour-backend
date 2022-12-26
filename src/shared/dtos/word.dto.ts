import { IsNumber, IsString } from 'class-validator';
import { Languages } from 'shared/enums';

export class WordDto {
  @IsString()
  text: string;

  @IsNumber()
  language: Languages;
}
