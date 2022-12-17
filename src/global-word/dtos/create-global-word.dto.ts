import { IsString } from 'class-validator';

export class CreateGlobalWord {
  @IsString()
  text: string;

  @IsString()
  language: string;
}
