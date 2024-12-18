import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PersonModule } from './person/person.module';
import { BookModule } from './book/book.module';
import { LogMiddleware } from './component/middleware/log.middleware';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { LoginGuard } from './component/guard/login.guard';
import { TimeInterceptor } from './component/interceptor/time.interceptor';
import { ConfcModuleFromDefinition } from './confc/confc.module';
import { TestFilter } from './component/filter/test.filter';

@Module({
  imports: [
    PersonModule,
    BookModule,
    // ConfcModule.register({ userName: 'confc' }),
    ConfcModuleFromDefinition.register({
      userName: 'ConfcModuleFromDefinition',
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // 开启全局守卫
    {
      provide: APP_GUARD,
      useClass: LoginGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TimeInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: TestFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogMiddleware).forRoutes('person');
  }
}
