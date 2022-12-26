import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from 'entities';
import { UserRoles } from 'shared/enums';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles: UserRoles[] = this.reflector.getAllAndMerge<UserRoles[]>(
      ROLES_KEY,
      [context.getClass(), context.getHandler()]
    );

    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: User = request.user;

    return roles.includes(user.role);
  }
}
