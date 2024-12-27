import { CanActivate, ExecutionContext, ForbiddenException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Permission } from 'src/person/entities/Permission.entity';
import { PersonService } from 'src/person/person.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  @Inject(Reflector)
  private reflector: Reflector;

  @Inject(PersonService)
  private personService: PersonService;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    console.log(request.user);
    if (!request.user) {
      return true;
    }
    const requirePermissions: string[] = this.reflector.getAllAndOverride('require-permission', [context.getClass(), context.getHandler()]);
    console.log('requirePermission', requirePermissions);

    if (!requirePermissions) {
      return true;
    }
    try {
      const roles = await this.personService.findRolesByIds(request.user.roles.map((role) => role.id));
      const permissions = roles.reduce((total: Permission[], role) => total.concat(...role.permissions), []);
      console.log('permissions', permissions);

      const hasPermission = permissions.some((permission) => requirePermissions.some((name) => name == permission.name));
      console.log('hasPermission', hasPermission);
      if (!hasPermission) {
        throw new ForbiddenException('您没有访问该接口的权限');
      }

      return true;
    } catch (e) {
      console.log(e);
      throw new ForbiddenException('您没有访问该接口的权限');
    }
  }
}
