import { PartialType } from '@nestjs/mapped-types';
import { CreateRoleDto } from '@/modules/roles/dtos/create.dto';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {}
