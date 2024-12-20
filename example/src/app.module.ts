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
import { WinstonModule } from './winston/winston.module';
import * as chalk from 'chalk';
import { transports, format } from 'winston';

@Module({
  imports: [
    PersonModule,
    BookModule,
    // ConfcModule.register({ userName: 'confc' }),
    ConfcModuleFromDefinition.register({
      userName: 'ConfcModuleFromDefinition',
    }),
    WinstonModule.forRoot({
      level: 'debug',
      transports: [
        new transports.Console({
          format: format.combine(
            format.colorize(),
            format.printf(({ context, level, message, time }) => {
              const appStr = chalk.green(`[NEST]`);
              const contextStr = chalk.yellow(`[${context}]`);

              return `${appStr} ${time} ${level} ${contextStr} ${message} `;
            }),
          ),
        }),
        new transports.File({
          format: format.combine(format.timestamp(), format.json()),
          filename: '111.log',
          dirname: 'log',
        }),
      ],
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
