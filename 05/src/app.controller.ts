import {
  Controller,
  Get,
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
import { Aaa } from './component/decorator/aaa.decorator';
import { AaaGuard } from './component/guard/aaa.guard';
import { Ccc, MyHeaders } from './component/decorator/ccc.decorator';

@UseGuards(LoginGuard) // 开启守卫
@UseInterceptors(TimeInterceptor) // 开启拦截器
// @UsePipes(ValidatePipe) // 开启管道
@UseFilters(TestFilter) // 开启过滤器
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @UseGuards(AaaGuard)
  @Aaa('admin')
  getHello(@Ccc() c: string, @MyHeaders('Accept') headers: string): string {
    console.log(c);
    console.log('headers', headers);
    return this.appService.getHello();
  }

  @Get('validate')
  validate(@Query('num', ValidatePipe) num: number) {
    return num;
  }
}
