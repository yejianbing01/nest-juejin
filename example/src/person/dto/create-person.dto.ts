import { IsInt, Length } from 'class-validator';

export class CreatePersonDto {
  @Length(5, 10, {
    message: '用户名长度必须在5到10之间',
    // message({ targetName, property, value, constraints }) {
    //   return `${targetName} 类的 ${property} 属性的值 ${value} 不满足约束: ${constraints}`;
    // },
  })
  username: string;

  @Length(5, 10, {
    message: '密码长度必须在5到10之间',
    // message({ targetName, property, value, constraints }) {
    //   return `${targetName} 类的 ${property} 属性的值 ${value} 不满足约束: ${constraints}`;
    // },
  })
  password: string;
}
