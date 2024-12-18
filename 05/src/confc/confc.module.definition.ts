import { ConfigurableModuleBuilder } from '@nestjs/common';

export interface CccModuleOptions {
  userName: string;
}

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  // 可以调用setClassMethodName('xxx') 设置注册方法名称
  new ConfigurableModuleBuilder<CccModuleOptions>().build();

// export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
//   new ConfigurableModuleBuilder<CccModuleOptions>()
//     .setClassMethodName('register')
//     .setExtras({ isGlobal: true }, (definition, extras) => ({  // 设置为全局模块
//       ...definition,
//       global: extras.isGlobal,
//     }))
//     .build();
