import { Controller, Get, Inject, Query, Req, Res, Session, UnauthorizedException, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { LoginGuard } from './component/guard/login.guard';
import { TimeInterceptor } from './component/interceptor/time.interceptor';
import { ValidatePipe } from './component/pipe/validate.pipe';
import { TestFilter } from './component/filter/test.filter';
// import { Aaa } from './component/decorator/aaa.decorator';
// import { AaaGuard } from './component/guard/aaa.guard';
import { Ccc, MyHeaders } from './component/decorator/ccc.decorator';
import { WINSTON_LOGGER_TOKEN } from './winston/winston.module';
import { MyLogger } from './winston/MyLogger';
import { ConfigService } from '@nestjs/config';
import { RedisClientType } from 'redis';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { SessionService } from './session/session.service';

@UseGuards(LoginGuard) // 开启守卫
@UseInterceptors(TimeInterceptor) // 开启拦截器
// @UsePipes(ValidatePipe) // 开启管道
@UseFilters(TestFilter) // 开启过滤器
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Inject(ConfigService)
  private configService: ConfigService;

  @Inject(WINSTON_LOGGER_TOKEN)
  private logger: MyLogger;

  @Inject(JwtService)
  private jwtService: JwtService;

  @Inject(SessionService)
  private sessionService: SessionService;

  @Get('count123')
  async count(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const sid = req.cookies?.sid;
    console.log('sid', sid);
    const session = await this.sessionService.getSession<{ count: string }>(sid);
    console.log(session);
    const curCount = session.count ? parseInt(session.count) + 1 : 1;
    const curSid = await this.sessionService.setSession(sid, {
      count: curCount,
    });
    res.cookie('sid', curSid, { maxAge: 1800000 });
    return curCount;
  }

  @Get('config')
  getConfig() {
    console.log('config', this.configService.get('a'));
    return {
      a: this.configService.get('a'),
      b: this.configService.get('b'),
      c: this.configService.get('c'),
      db: this.configService.get('db'),
    };
  }

  @Get()
  // @UseGuards(AaaGuard)
  // @Aaa('admin')
  getHello(@Ccc() c: string, @MyHeaders('Accept') headers: string): string {
    this.logger.log('hello', '');
    this.logger.log('headers', headers);
    return this.appService.getHello();
  }

  @Get('validate')
  validate(@Query('num', ValidatePipe) num: number) {
    return num;
  }

  @Get('session')
  session(@Session() session) {
    session.count = session.count ? session.count + 1 : 1;
    return session.count;
  }

  @Get('jwt')
  jwt(@Res({ passthrough: true }) response: Response, @MyHeaders('Authorization') authorization: string) {
    console.log({ authorization });
    if (authorization) {
      try {
        const token = authorization.split(' ')[1];
        const data = this.jwtService.verify(token);

        const newToken = this.jwtService.sign({
          count: data.count + 1,
        });
        response.setHeader('token', newToken);
        return data.count + 1;
      } catch (e) {
        console.log(e);
        throw new UnauthorizedException();
      }
    } else {
      const newToken = this.jwtService.sign({ count: 1 });
      response.setHeader('token', newToken);
      return 'ok';
    }
  }
}
