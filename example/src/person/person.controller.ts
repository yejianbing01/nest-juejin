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
} from '@nestjs/common';
import { PersonService } from './person.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { storage } from 'src/component/storage';

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
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 20 }),
          new FileTypeValidator({ fileType: 'image/jpeg' }),
        ],
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
  findAll() {
    console.log(this.person);
    console.log(this.personFromUseFactory);
    return this.personService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.personService.findOne(+id);
  }
}
