import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  Inject,
  ValidationPipe,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  HttpException,
  Res,
} from '@nestjs/common';
import { PersonService } from './person.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { storage } from 'src/component/storage';
import { InjectRepository } from '@nestjs/typeorm';
import { Person } from './entities/person.entity';
import { Repository } from 'typeorm';
import { LoginPersonDto } from './dto/login-person.dto';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { md5 } from 'src/component/utils';
import { RequireLogin, RequirePermission } from 'src/component/decorator/custom.decorator';

@Controller('person')
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  // 1. 注入useClass的provider
  @Inject('person_service')
  private readonly personService2: PersonService;
  // 2. 注入useValue的provider
  @Inject('person')
  private readonly person: { name: string; age: number };
  @Inject('person_factory')
  private readonly personFromUseFactory: { name: string; age: number };

  @InjectRepository(Person)
  private personRepository: Repository<Person>;

  @Inject(JwtService)
  private jwtService: JwtService;

  @Post('file')
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: storage,
    }),
  )
  file(
    @Body() createPersonDto: CreatePersonDto,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 20 }), new FileTypeValidator({ fileType: 'image/jpeg' })],
      }),
    )
    file: Array<Express.Multer.File>,
  ) {
    console.log(createPersonDto);
    console.log(file);
    return '接收到文件';
  }

  @Post()
  create(@Body(ValidationPipe) createPersonDto: CreatePersonDto) {
    return this.personService.create(createPersonDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePersonDto: UpdatePersonDto) {
    return this.personService.update(+id, updatePersonDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.personService.remove(+id);
  }

  @Get()
  @RequireLogin()
  @RequirePermission('查询 bbb')
  findAll() {
    console.log(this.person);
    console.log(this.personFromUseFactory);
    return this.personService.findAll();
  }

  @Get('init')
  async initData() {
    await this.personService.initData();
    return 'done';
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.personService.findOne(+id);
  }

  @Post('register')
  async register(@Body() createPersonDto: CreatePersonDto) {
    const foundPerson = await this.personRepository.findOneBy({
      username: createPersonDto.username,
    });
    if (foundPerson) {
      throw new HttpException('用户名已存在', 200);
    }

    const user = new Person();
    user.username = createPersonDto.username;
    user.password = md5(createPersonDto.password);
    try {
      await this.personRepository.save(user);
      return '注册成功';
    } catch (e) {
      console.log(e);
      throw '注册失败';
    }
  }

  @Post('login')
  async login(@Body() loginPersonDto: LoginPersonDto, @Res({ passthrough: true }) res: Response) {
    const foundPerson = await this.personRepository.findOne({
      where: { username: loginPersonDto.username },
      relations: { roles: true },
    });

    if (!foundPerson) {
      throw new HttpException('用户名不存在', 200);
    }
    if (foundPerson.password !== md5(loginPersonDto.password)) {
      throw new HttpException('密码错误', 200);
    }

    const token = this.jwtService.sign({
      id: foundPerson.id,
      username: foundPerson.username,
      roles: foundPerson.roles,
    });
    res.setHeader('token', token);
    return { token };
  }
}
