import { Module } from '@nestjs/common';
import { DbService } from './db.service';

@Module({})
export class DbModule {
  static register(options: DbModuleOptions) {
    return {
      module: DbModule,
      providers: [
        DbService,
        {
          provide: 'OPTIONS',
          useValue: options,
        },
      ],
      exports: [DbService],
    };
  }
}

export interface DbModuleOptions {
  path: string;
}
