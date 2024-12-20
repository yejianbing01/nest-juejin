import { PartialType } from '@nestjs/mapped-types';
import { CreateConfcDto } from './create-confc.dto';

export class UpdateConfcDto extends PartialType(CreateConfcDto) {}
