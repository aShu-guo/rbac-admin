import { Column, PrimaryColumn } from 'typeorm';
import { DateTimeTransform, UUIDWithSwapTransform } from '@/common/orm/transforms';
import * as dayjs from 'dayjs';
import { Exclude } from 'class-transformer';

export class BaseEntity {
  @PrimaryColumn({
    type: 'binary',
    length: 16,
    generated: false,
    transformer: UUIDWithSwapTransform,
  })
  id: string;

  @Column({
    name: 'create_time',
    transformer: DateTimeTransform,
  })
  createTime: string;

  @Column({
    name: 'update_time',
    default: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    transformer: DateTimeTransform,
  })
  @Exclude({ toPlainOnly: true })
  updateTime: string;

  @Column({ default: 0 })
  @Exclude({ toPlainOnly: true })
  valid: number;

  constructor(partial: Partial<BaseEntity>) {
    Object.assign(this, partial);
  }
}
