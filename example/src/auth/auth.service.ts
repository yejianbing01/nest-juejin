import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { md5 } from 'src/component/utils';
import { PersonService } from 'src/person/person.service';

@Injectable()
export class AuthService {
  @Inject()
  private personService: PersonService;

  async validateUser(username: string, pass: string) {
    const user = await this.personService.findOneBy({ username });

    if (!user) {
      throw new UnauthorizedException('用户不存在');
    }
    if (user.password !== md5(pass)) {
      throw new UnauthorizedException('密码错误');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result;
  }
}
