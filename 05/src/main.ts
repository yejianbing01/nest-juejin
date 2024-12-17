import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
// import { LoginGuard } from './login.guard';
// import { NextFunction, Response, Request } from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets('public', { prefix: '/static' });
  // 全局中间件和express的中间件一样
  // app.use((req: Request, res: Response, next: NextFunction) => {
  //   console.log('req====> ', req);
  //   next();
  //   console.log('res====> ', res);
  // });
  // 全局守卫
  // app.useGlobalGuards(new LoginGuard());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
