import {
  Controller,
  Get,
  Inject,
  Query,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
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
}