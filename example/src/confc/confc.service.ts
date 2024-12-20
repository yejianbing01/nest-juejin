import { Injectable } from '@nestjs/common';
import { CreateConfcDto } from './dto/create-confc.dto';
import { UpdateConfcDto } from './dto/update-confc.dto';

@Injectable()
export class ConfcService {
  create(createConfcDto: CreateConfcDto) {
    return 'This action adds a new confc';
  }

  findAll() {
    return `This action returns all confc`;
  }

  findOne(id: number) {
    return `This action returns a #${id} confc`;
  }

  update(id: number, updateConfcDto: UpdateConfcDto) {
    return `This action updates a #${id} confc`;
  }

  remove(id: number) {
    return `This action removes a #${id} confc`;
  }
}
