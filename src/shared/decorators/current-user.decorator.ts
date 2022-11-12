import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'shared/entities/user.entity';

export const GetCurrentUser = createParamDecorator((data: never, ctx: ExecutionContext): User => {
  const req = ctx.switchToHttp().getRequest();
  return req.user;
});
