import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dtos/sign-in.dto';
import { SignUpDto } from './dtos/sign-up.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-up')
  signUp(@Body() body: SignUpDto) {
    return this.authService.signUp(body);
  }

  @Post('/sign-in')
  signIn(@Body() body: SignInDto) {
    return this.authService.signIn(body);
  }
}
