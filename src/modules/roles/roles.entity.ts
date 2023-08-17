import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@/common/orm/base-entity';
import { pick } from 'lodash';
@Entity({ name: 'roles' })
export class RolesEntity extends BaseEntity {
  @Column()
  name: string;

  @Column()
  slug: string;

  constructor(partial: Partial<RolesEntity>) {
    super(pick(partial, ['updateTime', 'id', 'createTime', 'valid']));
    Object.assign(this, partial);
  }
}
