import { IsString } from 'class-validator';
import { Languages } from 'shared/enums';

export class WordDto {
  @IsString()
  text: string;

  @IsString()
  language: Languages;
}
