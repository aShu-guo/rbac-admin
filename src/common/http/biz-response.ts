export class BizResponse<T> {
  private constructor(private data: T, private message: string, private bizCode: number) {}

  /**
   * 静态函数，处理成功时返回
   * @param data
   * @param message
   */
  static ok<T>(data: T, message = 'success'): BizResponse<T> {
    return new BizResponse<T>(data, message, 200);
  }

  /**
   * 静态函数，处理失败时返回
   * @param message
   * @param bizCode
   */
  static fail(bizCode = 500, message: string): BizResponse<any> {
    return new BizResponse<any>(null, message, bizCode);
  }
}
