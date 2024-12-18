import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFiles,
  Inject,
  ValidationPipe,
} from '@nestjs/common';
import { PersonService } from './person.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

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

  @Post()
  create(@Body(ValidationPipe) createPersonDto: CreatePersonDto) {
    return this.personService.create(createPersonDto);
  }

  @Post('file')
  @UseInterceptors(
    AnyFilesInterceptor({
      dest: 'uploads/',
    }),
  )
  file(
    @Body() createPersonDto: CreatePersonDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    console.log(createPersonDto);
    console.log(files);
    return '接收到文件';
  }

  @Get()
  findAll() {
    console.log(this.person);
    console.log(this.personFromUseFactory);
    return this.personService.findAll();
  }

  @Get('find')
  find(@Query('name') name: string, @Query('age') age: number) {
    // return this.personService.findByQuery({ name, age });
    return this.personService2.findByQuery({ name, age });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.personService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePersonDto: UpdatePersonDto) {
    return this.personService.update(+id, updatePersonDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.personService.remove(+id);
  }
}
