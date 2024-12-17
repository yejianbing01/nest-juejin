import { Module } from '@nestjs/common';
import { PersonService } from './person.service';
import { PersonController } from './person.controller';

@Module({
  controllers: [PersonController],
  providers: [
    PersonService,
    {
      provide: 'person_service',
      useClass: PersonService,
    },
  ],
})
export class PersonModule {}
