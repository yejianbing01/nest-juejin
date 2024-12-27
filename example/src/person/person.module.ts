import { forwardRef, Module } from '@nestjs/common';
import { PersonService } from './person.service';
import { PersonController } from './person.controller';
import { BookModule } from 'src/book/book.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Person } from './entities/person.entity';
import { JwtModule } from '@nestjs/jwt';
import { Role } from './entities/Role.entity';
import { Permission } from './entities/Permission.entity';

@Module({
  imports: [
    forwardRef(() => BookModule),
    TypeOrmModule.forFeature([Person, Role, Permission]),
    JwtModule.register({
      secret: 'nest-test',
      signOptions: { expiresIn: '30m' },
    }),
  ],
  controllers: [PersonController],
  providers: [
    // 1. useClass简写
    PersonService,
    // 1.1 useClass
    {
      provide: 'person_service',
      useClass: PersonService,
    },
    // 2. useValue
    {
      provide: 'person',
      useValue: {
        name: 'provide_name',
        age: 16,
      },
    },
    // 3. useFactory--可以是 异步 或者 同步
    {
      provide: 'person_factory',
      async useFactory(person: { name: string }, personService: PersonService) {
        return {
          name: person.name || 'factory_person_name',
          age: 16,
          desc: await personService.findAll(),
        };
      },
      inject: ['person', PersonService],
    },
    // 4. useExisting 指定别名
    {
      provide: 'person_useExisting',
      useExisting: 'person',
    },
  ],
  exports: [PersonService],
})
export class PersonModule {}
