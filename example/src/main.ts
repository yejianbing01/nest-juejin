import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { WINSTON_LOGGER_TOKEN } from './winston/winston.module';
import * as session from 'express-session';
import { ValidationPipe } from '@nestjs/common';
// import { TimeInterceptor } from './time.interceptor';
// import { LoginGuard } from './login.guard';
// import { NextFunction, Response, Request } from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });

  app.useStaticAssets('public', { prefix: '/static' });
  // 全局中间件和express的中间件一样
  // app.use((req: Request, res: Response, next: NextFunction) => {
  //   console.log('req====> ', req);
  //   next();
  //   console.log('res====> ', res);
  // });
  // 全局守卫
  // app.useGlobalGuards(new LoginGuard());
  // 全局拦截器
  // app.useGlobalInterceptors(new TimeInterceptor());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // 引入自定义日志
  app.useLogger(app.get(WINSTON_LOGGER_TOKEN));

  app.use(
    session({
      secret: 'nest-test',
      resave: false, // resave 为 true 是每次访问都会更新 session，不管有没有修改 session 的内容，而 false 是只有 session 内容变了才会去更新 session
      saveUninitialized: false, // saveUninitalized 设置为 true 是不管是否设置 session，都会初始化一个空的 session 对象。比如你没有登录的时候，也会初始化一个 session 对象
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
