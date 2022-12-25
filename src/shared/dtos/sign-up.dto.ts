import { IsNotEmpty, IsString } from 'class-validator';
import { Match } from 'shared/decorators';

export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  @Match('password')
  private passwordConfirm: string;
}
