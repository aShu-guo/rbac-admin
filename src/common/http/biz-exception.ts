export class BizException extends Error {
  constructor(private readonly bizCode: number, private readonly errorTips: string) {
    super(errorTips);
  }

  getBizCode() {
    return this.bizCode;
  }

  getErrorTips() {
    return this.errorTips;
  }
}
