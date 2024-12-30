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
import { TypeOrmModule } from '@nestjs/typeorm';
import { Person } from './person/entities/person.entity';
import { CityModule } from './city/city.module';
import { City } from './city/entities/city.entity';
import { ConfigModule } from '@nestjs/config';
import * as path from 'path';
import config from '../config';
import { JwtModule } from '@nestjs/jwt';
import { Role } from './person/entities/Role.entity';
import { Permission } from './person/entities/Permission.entity';
import { PermissionGuard } from './component/guard/permission.guard';
import { AuthModule } from './auth/auth.module';
import { RedisModule } from './redis/redis.module';
import { SessionModule } from './session/session.module';

@Module({
  imports: [
    AuthModule,
    PersonModule,
    BookModule,
    CityModule,
    ConfigModule.forRoot({
      // 前面的配置覆盖后面的配置
      envFilePath: [path.join(process.cwd(), '.env'), path.join(process.cwd(), '.env.prod')],
      // 使用ts文件加载配置
      load: [config],
    }),
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
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'typeorm_test',
      synchronize: true,
      logging: true,
      entities: [Person, City, Role, Permission],
      poolSize: 10,
      connectorPackage: 'mysql2',
      extra: {
        authPlugin: 'sha256_password',
      },
    }),
    JwtModule.register({
      secret: 'nest-test',
      signOptions: { expiresIn: '1d' },
    }),
    RedisModule,
    SessionModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // 开启全局守卫
    { provide: APP_GUARD, useClass: LoginGuard },
    { provide: APP_GUARD, useClass: PermissionGuard },
    { provide: APP_INTERCEPTOR, useClass: TimeInterceptor },
    { provide: APP_FILTER, useClass: TestFilter },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogMiddleware).forRoutes('person');
  }
}
