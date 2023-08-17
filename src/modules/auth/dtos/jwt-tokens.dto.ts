export class JwtTokensDto {
  access_token: string;

  refresh_token: string;

  constructor(partial: Partial<JwtTokensDto>) {
    Object.assign(this, partial);
  }
}
