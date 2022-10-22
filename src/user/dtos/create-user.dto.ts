import { IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(42, 42, { message: 'account address must be equal to 42 characters' })
  accountAddress: string;
}
