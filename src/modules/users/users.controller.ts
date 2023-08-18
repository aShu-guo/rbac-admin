import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UsersService } from '@/modules/users/users.service';
import { UsersEntity } from '@/modules/users/users.entity';
import { Public } from '@/modules/auth/auth.guard';
import { EndPoints } from '@/modules/users/users.constants';

@Controller(EndPoints.Index)
export class UsersController {
  constructor(private userService: UsersService) {}

  @Public()
  @Get(EndPoints.List)
  getUserList(): Promise<UsersEntity[]> {
    return this.userService.findAll();
  }

  @Get('/detail/:id')
  findOne(@Param('id') id: number) {
    console.log(typeof id === 'number'); // true
    return 'This action returns a user';
  }
}
