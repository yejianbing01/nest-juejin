import { Injectable } from '@nestjs/common';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { BookService } from 'src/book/book.service';
import { EntityManager, FindOptionsWhere, In } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { Person } from './entities/person.entity';
import { Role } from './entities/Role.entity';
import { Permission } from './entities/Permission.entity';
import { md5 } from 'src/component/utils';

@Injectable()
export class PersonService {
  // 注入其他模块的service，也可以导入全局模块
  constructor(private bookService: BookService) {}

  @InjectEntityManager()
  private entityManager: EntityManager;

  create(createPersonDto: CreatePersonDto) {
    this.entityManager.save(Person, createPersonDto);
  }

  update(id: number, updatePersonDto: UpdatePersonDto) {
    this.entityManager.save(Person, {
      id,
      ...updatePersonDto,
    });
  }

  remove(id: number) {
    this.entityManager.delete(Person, id);
  }

  findAll() {
    return this.entityManager.find(Person);
  }

  findOne(id: number) {
    return this.entityManager.findOne(Person, { where: { id } });
  }

  findOneBy(where: FindOptionsWhere<Person>) {
    return this.entityManager.findOne(Person, { where });
  }

  async findRolesByIds(roleIds: number[]) {
    return this.entityManager.find(Role, {
      where: {
        id: In(roleIds),
      },
      relations: {
        permissions: true,
      },
    });
  }

  async initData() {
    const user1 = new Person();
    user1.username = '张三';
    user1.password = md5('111111');

    const user2 = new Person();
    user2.username = '李四';
    user2.password = md5('222222');

    const user3 = new Person();
    user3.username = '王五';
    user3.password = md5('333333');

    const role1 = new Role();
    role1.name = '管理员';

    const role2 = new Role();
    role2.name = '普通用户';

    const permission1 = new Permission();
    permission1.name = '新增 aaa';

    const permission2 = new Permission();
    permission2.name = '修改 aaa';

    const permission3 = new Permission();
    permission3.name = '删除 aaa';

    const permission4 = new Permission();
    permission4.name = '查询 aaa';

    const permission5 = new Permission();
    permission5.name = '新增 bbb';

    const permission6 = new Permission();
    permission6.name = '修改 bbb';

    const permission7 = new Permission();
    permission7.name = '删除 bbb';

    const permission8 = new Permission();
    permission8.name = '查询 bbb';

    role1.permissions = [permission1, permission2, permission3, permission4, permission5, permission6, permission7, permission8];

    role2.permissions = [permission1, permission2, permission3, permission4];

    user1.roles = [role1];

    user2.roles = [role2];

    await this.entityManager.save(Permission, [permission1, permission2, permission3, permission4, permission5, permission6, permission7, permission8]);

    await this.entityManager.save(Role, [role1, role2]);

    await this.entityManager.save(Person, [user1, user2]);
  }
}
