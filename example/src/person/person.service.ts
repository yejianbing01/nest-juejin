import { Injectable } from '@nestjs/common';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { BookService } from 'src/book/book.service';
import { EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { Person } from './entities/person.entity';

@Injectable()
export class PersonService {
  // 注入其他模块的service，也可以导入全局模块
  constructor(private bookService: BookService) {}

  @InjectEntityManager()
  private manager: EntityManager;

  create(createPersonDto: CreatePersonDto) {
    this.manager.save(Person, createPersonDto);
  }

  update(id: number, updatePersonDto: UpdatePersonDto) {
    this.manager.save(Person, {
      id,
      ...updatePersonDto,
    });
  }

  remove(id: number) {
    this.manager.delete(Person, id);
  }

  findAll() {
    return this.manager.find(Person);
  }

  findOne(id: number) {
    return this.manager.findOne(Person, { where: { id } });
  }
}
