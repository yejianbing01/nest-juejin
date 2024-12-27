import { Controller, Get, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  @Inject(JwtService)
  private jwtService: JwtService;

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Req() req: Request) {
    console.log(req.user);
    const token = this.jwtService.sign(req.user);
    return { token };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('list')
  list(@Req() req: Request) {
    console.log(req.user);
    return ['111', '222', '333', '444', '555'];
  }

  @Get('loginGithub')
  @UseGuards(AuthGuard('github'))
  async loginGithub() {
    return 'github';
  }

  @Get('callback')
  @UseGuards(AuthGuard('github'))
  async authCallback(@Req() req) {
    console.log(req.user);
    return req.user;
  }
}
