import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { RolesEntity } from '@/modules/roles/roles.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateRoleDto } from '@/modules/roles/dtos/create.dto';

@Injectable()
export class RolesService {
  constructor(@InjectRepository(RolesEntity) private rolesRepository: Repository<RolesEntity>) {}

  async create(createRoleDto: CreateRoleDto): Promise<RolesEntity | undefined> {
    return await this.rolesRepository.save(new RolesEntity(createRoleDto));
  }

  /**
   * 根据实体查询数据
   * @param readRoleDto
   */
  async findOneBy(readRoleDto: Partial<RolesEntity>): Promise<RolesEntity | undefined> {
    return await this.rolesRepository.findOneBy({ ...readRoleDto, valid: 1 });
  }

  async findAll(): Promise<RolesEntity[]> {
    return await this.rolesRepository.findBy({ valid: 1 });
  }
}
