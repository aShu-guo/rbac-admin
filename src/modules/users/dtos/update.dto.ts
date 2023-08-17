import { CreateUserDto } from '@/modules/users/dtos/create.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  status?: number;

  valid?: number;
}
