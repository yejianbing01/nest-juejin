import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entities/book.entity';

@Injectable()
export class BookService {
  @Inject(DbService)
  private dbService: DbService;

  async create(createBookDto: CreateBookDto) {
    const books: Book[] = await this.dbService.read();
    const existed = books.some((book) => book.name === createBookDto.name);
    if (existed) {
      throw new BadRequestException('同名图书已存在');
    }

    const book = new Book();
    book.id = createBookId();
    book.name = createBookDto.name;
    book.author = createBookDto.author;
    book.cover = createBookDto.cover;
    book.description = createBookDto.description;
    books.push(book);
    await this.dbService.write(books);
    return book;
  }

  async update(updateBookDto: UpdateBookDto) {
    const books: Book[] = await this.dbService.read();
    const book = books.find((book) => book.id === updateBookDto.id);
    if (!book) {
      throw new BadRequestException('图书不存在');
    }

    book.name = updateBookDto.name;
    book.author = updateBookDto.author;
    book.cover = updateBookDto.cover;
    book.description = updateBookDto.description;
    await this.dbService.write(books);
    return book;
  }

  async delete(id: number) {
    const books: Book[] = await this.dbService.read();
    const book = books.find((book) => book.id === id);
    if (!book) {
      throw new BadRequestException('图书不存在');
    }
    const index = books.indexOf(book);
    books.splice(index, 1);
    await this.dbService.write(books);
    return book;
  }

  async list() {
    const books: Book[] = await this.dbService.read();
    return books;
  }

  async findById(id: number) {
    const books: Book[] = await this.dbService.read();
    const book = books.find((book) => book.id === id);
    if (!book) {
      throw new BadRequestException('图书不存在');
    }
    return book;
  }
}

function createBookId() {
  return Math.floor(Math.random() * 10000000);
}
