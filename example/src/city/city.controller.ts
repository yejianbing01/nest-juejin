import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CityService } from './city.service';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { City } from './entities/city.entity';
import { EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';

@Controller('city')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @InjectEntityManager()
  private entityMange: EntityManager;

  @Post()
  create(@Body() createCityDto: CreateCityDto) {
    return this.cityService.create(createCityDto);
  }

  @Get()
  async findAll() {
    // const city = new City();
    // city.name = '华南';
    // await this.entityMange.save(City, city);

    // const cityChild = new City();
    // cityChild.name = '广东';
    // const parent = await this.entityMange.findOne(City, {
    //   where: { name: '华南' },
    // });
    // if (parent) {
    //   cityChild.parent = parent;
    // }
    // await this.entityMange.save(City, cityChild);

    //  1. 查询的是所有节点
    // return this.entityMange.getTreeRepository(City).findTrees();
    //  2. 查询的是所有根节点
    // return this.entityMange.getTreeRepository(City).findRoots();
    // 3. findDescendantsTree 是查询某个节点的所有后代节点
    const parent = await this.entityMange.findOne(City, {
      where: {
        name: '华南',
      },
    });
    return this.entityMange.getTreeRepository(City).findDescendantsTree(parent);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cityService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCityDto: UpdateCityDto) {
    return this.cityService.update(+id, updateCityDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cityService.remove(+id);
  }
}
