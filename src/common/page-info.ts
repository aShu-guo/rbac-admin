export class PageInfo<T extends any[]> {
  pageNum = 1;
  pageSize = 10;
  total = 0;
  records: T;

  constructor(partial: Partial<PageInfo<T>>) {
    Object.assign(this, partial);
  }
}
