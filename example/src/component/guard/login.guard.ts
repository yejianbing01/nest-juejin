import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
// import { PersonService } from './person/person.service';

@Injectable()
export class LoginGuard implements CanActivate {
  // 可以注入
  // @Inject(PersonService)
  // private personService: PersonService;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log('login check');
    return true;
  }
}
