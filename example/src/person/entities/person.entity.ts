import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Role } from './Role.entity';

@Entity()
export class Person {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 50,
    comment: '用户名',
  })
  username: string;

  @Column({
    length: 50,
    comment: '密码',
  })
  password: string;

  @CreateDateColumn({
    comment: '创建时间',
  })
  createTime: Date;

  @UpdateDateColumn({
    comment: '更新时间',
  })
  updateTime: Date;

  @ManyToMany(() => Role)
  @JoinTable({
    name: 'person_role_relation',
  })
  roles: Role[];
}
