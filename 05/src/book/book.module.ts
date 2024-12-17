import {
  BeforeApplicationShutdown,
  Global,
  Module,
  OnApplicationBootstrap,
  OnApplicationShutdown,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';

@Global() // 声明为全局模块
@Module({
  controllers: [BookController],
  providers: [BookService],
  // 导出该模块，可供其他模块注入
  exports: [BookService],
})
export class BookModule
  implements
    OnModuleInit,
    OnApplicationBootstrap,
    OnModuleDestroy,
    BeforeApplicationShutdown,
    OnApplicationShutdown
{
  onModuleDestroy() {
    console.log('BookModule - onModuleDestroy');
  }
  beforeApplicationShutdown(signal?: string) {
    console.log('BookModule - beforeApplicationShutdown' + signal);
  }
  onModuleInit() {
    console.log('BookModule - onModuleInit');
  }
  onApplicationBootstrap() {
    console.log('BookModule - onApplicationBootstrap');
  }
  onApplicationShutdown(signal?: string) {
    console.log('BookController - onApplicationShutdown' + signal);
  }
}
