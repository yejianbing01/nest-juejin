import {
  Controller,
  Get,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { LoginGuard } from './login.guard';
import { TimeInterceptor } from './time.interceptor';
import { ValidatePipe } from './validate.pipe';

@UseGuards(LoginGuard) // 开启守卫
@UseInterceptors(TimeInterceptor) // 开启拦截器
// @UsePipes(ValidatePipe) // 开启管道
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('validate')
  validate(@Query('num', ValidatePipe) num: number) {
    return num;
  }
}
