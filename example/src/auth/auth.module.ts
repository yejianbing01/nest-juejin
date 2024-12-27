import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { PersonModule } from 'src/person/person.module';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { GithubStrategy } from './github.strategy';

@Module({
  imports: [
    PersonModule,
    JwtModule.register({
      secret: 'nest-test',
      signOptions: { expiresIn: '30m' },
    }),
  ],
  providers: [AuthService, GithubStrategy], //  LocalStrategy, JwtStrategy,
  controllers: [AuthController],
})
export class AuthModule {}
