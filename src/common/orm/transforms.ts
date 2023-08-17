import * as dayjs from 'dayjs';
import { ValueTransformer } from 'typeorm';

/**
 * mysql数据类型为datetime
 * ex:
 *  in: 2023-08-08T06:34:43.014Z
 *  out: 2023-08-06 12:22:33
 */
export const DateTimeTransform: ValueTransformer = {
  to(value: string): Date {
    return dayjs(value).toDate();
  },
  from(value: Date): string {
    return dayjs(value).format('YYYY-MM-DD HH:mm:ss');
  },
};

/**
 * mysql数据类型为binary(16)
 * ex:
 *  in: 0x11EE35B38DDECE46BA3A4215A4F8EDBC
 *  out: ec74ff16-35b3-11ee-ba3a-4215a4f8edbc
 */
export const UUIDWithSwapTransform: ValueTransformer = {
  to: (uuid: string) => {
    return uuid
      ? Buffer.from(
          uuid.slice(14, 18) + uuid.slice(9, 13) + uuid.slice(0, 8) + uuid.slice(19, 23) + uuid.slice(-12),
          'hex',
        )
      : uuid;
  },
  from: (bin: Buffer) => {
    // 插入数据时，返回的数据id长度有误
    return bin.toString('hex').length === 32
      ? `${bin.toString('hex', 4, 8)}-${bin.toString('hex', 2, 4)}-${bin.toString('hex', 0, 2)}-${bin.toString(
          'hex',
          8,
          10,
        )}-${bin.toString('hex', 10, 16)}`
      : bin.toString('hex');
  },
};
