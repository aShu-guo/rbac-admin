import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UsersEntity } from '@/modules/users/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RolesService } from '@/modules/roles/roles.service';
import { SlugEnum } from '@/modules/roles/roles.constants';
import { UserStatus } from '@/modules/users/users.constants';
import { BizCode } from '@/common/http/biz-code';
import { omit } from 'lodash';
import { CreateUserDto } from '@/modules/users/dtos/create.dto';
import { v1 as uuidv1 } from 'uuid';
import { BizException } from '@/common/exceptions/biz-exception';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity) private userRepository: Repository<UsersEntity>,
    private roleService: RolesService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UsersEntity | undefined> {
    const isExist = await this.userRepository.findOneBy({ name: createUserDto.name, valid: 1 });
    if (isExist) {
      throw new BizException(BizCode.IsExist, '用户名已存在');
    }
    const role = await this.roleService.findOneBy({ slug: SlugEnum.ROLE_NORMAL });

    console.log(JSON.stringify(createUserDto));
    const id = uuidv1();
    await this.userRepository.insert(new UsersEntity({ id, roleId: role.id, ...createUserDto }));
    return await this.userRepository.findOneBy({ id });
  }

  async findAll(): Promise<UsersEntity[]> {
    return await this.userRepository.findBy({ valid: 1, status: UserStatus.Active });
  }

  findOne(userEntity: Partial<UsersEntity>): Promise<UsersEntity | null> {
    return this.userRepository.findOneBy(omit(userEntity, 'dataAdaptor'));
  }
}
