import {
  BeforeApplicationShutdown,
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BookService
  implements
    OnModuleInit,
    OnApplicationBootstrap,
    OnModuleDestroy,
    BeforeApplicationShutdown,
    OnApplicationShutdown
{
  onModuleDestroy() {
    console.log('BookService - onModuleDestroy');
  }
  beforeApplicationShutdown(signal?: string) {
    console.log('BookService - beforeApplicationShutdown' + signal);
  }
  onModuleInit() {
    console.log('BookService - onModuleInit');
  }
  onApplicationBootstrap() {
    console.log('BookService - onApplicationBootstrap');
  }
  onApplicationShutdown(signal?: string) {
    console.log('BookController - onApplicationShutdown' + signal);
  }
  create(createBookDto: CreateBookDto) {
    return 'This action adds a new book' + JSON.stringify(createBookDto);
  }

  findAll() {
    return `This action returns all book`;
  }

  findOne(id: number) {
    return `This action returns a #${id} book`;
  }

  update(id: number, updateBookDto: UpdateBookDto) {
    return `This action updates a #${id} book` + JSON.stringify(updateBookDto);
  }

  remove(id: number) {
    return `This action removes a #${id} book`;
  }
}
