import { BeforeInsert, Column, Entity } from 'typeorm';
import { UUIDWithSwapTransform } from '@/common/orm/transforms';
import { BaseEntity } from '@/common/orm/base-entity';
import * as bcrypt from 'bcrypt';
import { v1 as uuidv1 } from 'uuid';
import { Exclude } from 'class-transformer';
import { pick } from 'lodash';

@Entity({ name: 'users' })
export class UsersEntity extends BaseEntity {
  @Column({
    name: 'role_id',
    type: 'binary',
    length: 16,
    transformer: UUIDWithSwapTransform,
  })
  roleId: string;

  @Column()
  name: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column()
  @Exclude()
  salt: string;

  @Column({ name: 'nick_name' })
  nickName: string;

  @Column()
  status: number;

  constructor(partial: Partial<UsersEntity>) {
    super(partial);
    Object.assign(this, partial);
  }

  @BeforeInsert()
  private async dataAdaptor?() {
    if (!this.id) {
      this.id = uuidv1();
    }
    this.salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, this.salt);
  }
}
