import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  @Inject(AuthService)
  private authService: AuthService;

  async validate(username: string, password: string) {
    const user = await this.authService.validateUser(username, password);
    return user;
  }
}
