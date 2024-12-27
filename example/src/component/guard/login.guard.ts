import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { Role } from 'src/person/entities/Role.entity';
// import { PersonService } from './person/person.service';

declare module 'express' {
  interface Request {
    user: {
      id: number;
      username: string;
      roles: Role[];
    };
  }
}

@Injectable()
export class LoginGuard implements CanActivate {
  // 可以注入
  @Inject(JwtService)
  private jwtService: JwtService;

  @Inject(Reflector)
  private reflector: Reflector;

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const requireLogin = this.reflector.getAllAndOverride('requireLogin', [context.getClass(), context.getHandler()]);
    if (!requireLogin) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const authorization = request.header('Authorization') || '';
    const bearer = authorization.split(' ');

    if (!bearer || bearer.length < 2) {
      throw new UnauthorizedException('登录 token 错误');
    }
    const token = bearer[1];

    try {
      const user = this.jwtService.verify(token);
      request.user = user;
      return true;
    } catch (e) {
      console.log(e);
      throw new UnauthorizedException('登录 token 失效，请重新登录');
    }
  }
}
