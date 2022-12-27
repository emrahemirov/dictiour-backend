import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Match } from 'shared/decorators';
import { UserRoles } from 'shared/enums';

export class AddUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  role: UserRoles;

  @IsNotEmpty()
  @IsString()
  @Match('password')
  private passwordConfirm: string;
}
