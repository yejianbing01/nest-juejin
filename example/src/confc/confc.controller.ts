import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
} from '@nestjs/common';
import { ConfcService } from './confc.service';
import { CreateConfcDto } from './dto/create-confc.dto';
import { UpdateConfcDto } from './dto/update-confc.dto';
import { MODULE_OPTIONS_TOKEN } from './confc.module.definition';

@Controller('confc')
export class ConfcController {
  constructor(private readonly confcService: ConfcService) {}

  @Inject(MODULE_OPTIONS_TOKEN)
  private configOptions: Record<string, any>;

  @Post()
  create(@Body() createConfcDto: CreateConfcDto) {
    return this.confcService.create(createConfcDto);
  }

  @Get()
  findAll() {
    return this.confcService.findAll() + JSON.stringify(this.configOptions);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.confcService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateConfcDto: UpdateConfcDto) {
    return this.confcService.update(+id, updateConfcDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.confcService.remove(+id);
  }
}
