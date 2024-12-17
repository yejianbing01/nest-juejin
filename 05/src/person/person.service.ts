import { Injectable } from '@nestjs/common';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { BookService } from 'src/book/book.service';

@Injectable()
export class PersonService {
  // 注入其他模块的service，也可以导入全局模块
  constructor(private bookService: BookService) {}

  create(createPersonDto: CreatePersonDto) {
    return '接收到body参数' + JSON.stringify(createPersonDto);
  }

  findAll() {
    return `This action returns all person` + this.bookService.findAll();
  }

  findByQuery({ name, age }) {
    return `接收到query参数：name=${name}, age=${age}`;
  }

  findOne(id: number) {
    return `This action returns a #${id} person`;
  }

  update(id: number, updatePersonDto: UpdatePersonDto) {
    return '接收到body参数' + id + JSON.stringify(updatePersonDto);
  }

  remove(id: number) {
    return `This action removes a #${id} person`;
  }
}
