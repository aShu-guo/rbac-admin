import { SignInDto } from '@/modules/users/dtos/sign-in-dto';

export class CreateUserDto extends SignInDto {
  id: string;

  roleId: string;

  nickName: string;
}
