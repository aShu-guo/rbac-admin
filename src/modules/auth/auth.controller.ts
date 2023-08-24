import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards, Request, Query } from "@nestjs/common";
import { AuthService } from '@/modules/auth/auth.service';
import { SignInDto } from '@/modules/users/dtos/sign-in-dto';
import { AuthGuard, Public } from '@/modules/auth/auth.guard';
import { CreateUserDto } from '@/modules/users/dtos/create.dto';
import { BizResponse } from '@/common/http/biz-response';
import { UsersEntity } from '@/modules/users/users.entity';
import { EndPoints } from '@/modules/auth/auth.constants';
import { CurrentUser } from '@/modules/users/user.decorator';
import { JwtTokensDto } from '@/modules/auth/dtos/jwt-tokens.dto';

@Controller(EndPoints.Index)
export class AuthController {
  constructor(private authService: AuthService) {}

  // @Public()
  // @Get('code')
  //

  @Public()
  @Post(EndPoints.Register)
  async register(@Body() createUserDto: CreateUserDto): Promise<BizResponse<UsersEntity>> {
    return BizResponse.ok<UsersEntity>(await this.authService.register(createUserDto));
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post(EndPoints.Login)
  async login(@Body() signInDto: SignInDto): Promise<BizResponse<JwtTokensDto>> {
    return BizResponse.ok<JwtTokensDto>(await this.authService.signIn(signInDto.name, signInDto.password));
  }

  /**
   * 刷新token接口，限制：
   * 1. access_token失效时才可以被调用，否则抛出401
   * 2. 只能refresh_token合法、而且没有出现在黑名单上才可以调用，否则抛出401
   * @param request
   */
  @Public()
  @Get(EndPoints.Refresh)
  async refreshToken(@Request() request: Request): Promise<BizResponse<JwtTokensDto>> {
    const [type, refreshToken] = request.headers['authorization']?.split(' ') ?? [];
    return BizResponse.ok<JwtTokensDto>(await this.authService.refresh(type === 'Bearer' ? refreshToken : undefined));
  }

  @Get(EndPoints.Profile)
  getProfile(@CurrentUser() user: UsersEntity): BizResponse<UsersEntity> {
    return BizResponse.ok<UsersEntity>(user);
  }

  @Get('test')
  @Public()
  testVerifyIsOk(@Query('token') token: string) {
    return this.authService.testVerifyIsOk(token)
  }
}
