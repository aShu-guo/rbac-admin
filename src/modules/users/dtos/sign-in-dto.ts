import { IsNotEmpty } from 'class-validator';

/**
 * 用户登录用
 */
export class SignInDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  password: string;
}
