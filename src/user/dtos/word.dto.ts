import { IsString } from 'class-validator';

export class WordDto {
  @IsString()
  text: string;

  @IsString()
  language: string;
}
