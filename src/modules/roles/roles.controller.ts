import { Body, Controller, Get, Post } from '@nestjs/common';
import { RolesEntity } from '@/modules/roles/roles.entity';
import { Public } from '@/modules/auth/auth.guard';
import { RolesService } from '@/modules/roles/roles.service';
import { CreateRoleDto } from '@/modules/roles/dtos/create.dto';
import { BizResponse } from '@/common/http/biz-response';

@Controller('roles')
@Public()
export class RolesController {
  constructor(private rolesService: RolesService) {}

  @Post('add')
  async addRole(@Body() createRoleDto: CreateRoleDto): Promise<BizResponse<RolesEntity | undefined>> {
    try {
      return BizResponse.ok<RolesEntity>(await this.rolesService.create(createRoleDto));
    } catch (e) {
      console.error(e);
      // return BizResponse.fail('123');
    }
  }

  @Get('list')
  async getRolesList(): Promise<BizResponse<RolesEntity[]>> {
    try {
      return BizResponse.ok<RolesEntity[]>(await this.rolesService.findAll());
    } catch (e) {
      console.error(e);
      // return BizResponse.fail('123');
    }
  }
}
