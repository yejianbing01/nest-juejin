import { applyDecorators, Get, UseGuards } from '@nestjs/common';
import { Aaa } from './aaa.decorator';
import { AaaGuard } from '../guard/aaa.guard';

export function Bbb(path: string, role: string) {
  return applyDecorators(Get(path), Aaa(role), UseGuards(AaaGuard));
}
