import { DynamicModule, Module } from '@nestjs/common';
import { ConfcService } from './confc.service';
import { ConfcController } from './confc.controller';
import { ConfigurableModuleClass } from './confc.module.definition';

export class ConfcModule {
  static register(options: Record<string, any>): DynamicModule {
    return {
      module: ConfcModule,
      providers: [
        ConfcService,
        {
          provide: 'CONFIG_OPTIONS',
          useValue: options,
        },
      ],
      controllers: [ConfcController],
    };
  }
}

@Module({
  controllers: [ConfcController],
  providers: [ConfcService],
})
export class ConfcModuleFromDefinition extends ConfigurableModuleClass {}
