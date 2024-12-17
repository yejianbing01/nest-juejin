import { Global, Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';

@Global() // 声明为全局模块
@Module({
  controllers: [BookController],
  providers: [BookService],
  // 导出该模块，可供其他模块注入
  exports: [BookService],
})
export class BookModule {}
